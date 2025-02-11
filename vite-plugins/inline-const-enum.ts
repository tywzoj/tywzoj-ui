import type { BinaryExpression, Expression, PrivateName, TSEnumDeclaration } from "@babel/types";
import { babelParse, getLang, isTs } from "ast-kit";
import fg from "fast-glob";
import { readFile } from "fs/promises";
import path from "path";
import tsConfigPaths from "tsconfig-paths";
import type { Plugin } from "vite";

export interface IInlineConstEnumOptions {
    sourceDir: string;
    tsConfigPath: string;
}

export default function inlineConstEnum(options: IInlineConstEnumOptions): Plugin {
    const instance = new InlineConstEnum(options);
    let replacement: IReplacement;

    return {
        name: "vite:plugin-inline-const-enum",
        enforce: "pre",
        async configResolved() {
            await instance.initAsync();
            replacement = instance.getFileReplacement();
        },
        transform(code, id) {
            if (id.includes("node_modules")) {
                return null;
            }

            const [idWithoutSearch] = id.split("?");
            const moduleName = path.resolve(
                path.dirname(idWithoutSearch),
                path.basename(idWithoutSearch, path.extname(idWithoutSearch)),
            );

            if (moduleName in replacement && replacement[moduleName]) {
                for (const [enumName, members] of Object.entries(replacement[moduleName])) {
                    for (const [memberName, value] of Object.entries(members)) {
                        const memberNameRegExp = new RegExp(`\\b${enumName}\\s*\\.\\s*${memberName}\\b`, "g");
                        code = code.replace(memberNameRegExp, value);
                    }
                }

                return code;
            } else {
                return null;
            }
        },
    };
}

type IModuleName = string;
type IEnumName = string;
type IMemberName = string;

type ITsModule = { name: IModuleName; ast: ReturnType<typeof babelParse> };

type IConstEnumDeclaration = `${IModuleName}:${IEnumName}`;
type IConstEnumMember = `${IEnumName}.${IMemberName}`;
type IConstEnumRelation = Map<IConstEnumDeclaration, IConstEnumDeclaration>;
type IConstEnumDefinitionIdentifier = `${IConstEnumDeclaration}.${IMemberName}`;
type IConstEnumDefinitions = Map<IConstEnumDefinitionIdentifier, string>; // identifier => value

type IReplacement = Record<IModuleName, Record<IEnumName, Record<IMemberName, string>>>;

class InlineConstEnum {
    private tsConfigMatchPath: tsConfigPaths.MatchPath;

    private tsModules: ITsModule[] = [];
    private constEnumDeclarations: Set<IConstEnumDeclaration> = new Set();
    private constEnumImports: IConstEnumRelation = new Map();
    private constEnumExports: IConstEnumRelation = new Map();
    private constEnumDefinitions: IConstEnumDefinitions = new Map();

    constructor(private options: IInlineConstEnumOptions) {
        const result = tsConfigPaths.loadConfig(options.tsConfigPath);
        if (result.resultType === "failed") {
            throw new Error(result.message);
        }

        this.tsConfigMatchPath = tsConfigPaths.createMatchPath(result.absoluteBaseUrl, result.paths);
    }

    public async initAsync() {
        await this.loadTsModulesAsync();
        this.findConstEnumDeclarations();

        while (true) {
            const prevConstEnumExportsSize = this.constEnumExports.size;
            this.findConstEnumExports();
            const nextConstEnumExportsSize = this.constEnumExports.size;

            const prevConstEnumImportsSize = this.constEnumImports.size;
            this.findConstEnumImports();
            const nextConstEnumImportsSize = this.constEnumImports.size;

            // If there are no new const enum exports and imports,
            // the dependency graph is complete and we can stop the loop
            if (
                prevConstEnumExportsSize === nextConstEnumExportsSize &&
                prevConstEnumImportsSize === nextConstEnumImportsSize
            ) {
                break;
            }
        }

        while (true) {
            const prevConstEnumDefinitionsSize = this.constEnumDefinitions.size;
            this.findConstEnumDefinitions();
            const nextConstEnumDefinitionsSize = this.constEnumDefinitions.size;

            // If there are no new const enum definitions,
            // that means all const enum members have been defined
            if (prevConstEnumDefinitionsSize === nextConstEnumDefinitionsSize) {
                break;
            }
        }
    }

    public getFileReplacement(): IReplacement {
        const replacements: IReplacement = {};
        const enumMembers = new Map<IConstEnumDeclaration, IMemberName[]>();

        for (const definition of this.constEnumDefinitions.keys()) {
            // moduleName may include "." character, so we need to split it by the first occurrence of ":" character.
            const [moduleName, enumItem] = definition.split(":") as [IModuleName, IConstEnumMember];
            const [enumName, memberName] = enumItem.split(".") as [IEnumName, IMemberName];
            const declaration: IConstEnumDeclaration = `${moduleName}:${enumName}`;

            if (!enumMembers.has(declaration)) {
                enumMembers.set(declaration, []);
            }

            enumMembers.get(declaration)!.push(memberName);
        }

        const declarations = new Set([...this.constEnumImports.keys(), ...this.constEnumDeclarations.keys()]);
        for (const declaration of declarations) {
            const [moduleName, enumName] = declaration.split(":") as [IModuleName, IEnumName];

            if (!replacements[moduleName]) {
                replacements[moduleName] = {};
            }

            const rootDeclaration = this.getConstEnumRootDeclaration(declaration);
            if (!rootDeclaration) {
                throw new Error(`Root declaration not found for ${enumName} in ${moduleName}`);
            }

            const memberNames = enumMembers.get(rootDeclaration);
            if (!memberNames) {
                throw new Error(`Members not found for ${rootDeclaration}`);
            }

            for (const memberName of memberNames) {
                const value = this.constEnumDefinitions.get(`${rootDeclaration}.${memberName}`);

                if (!value) {
                    throw new Error(`Value not found for ${memberName}.${memberName} in ${moduleName}`);
                }

                if (!replacements[moduleName][memberName]) {
                    replacements[moduleName][memberName] = {};
                }

                replacements[moduleName][memberName][memberName] = value;
            }
        }

        return replacements;
    }

    private async loadTsModulesAsync() {
        const files = await fg.async(`**/*.{ts,cts,mts,tsx}`, {
            cwd: this.options.sourceDir,
        });

        this.tsModules = await Promise.all(
            files
                .filter((file) => isTs(getLang(file)))
                .map<Promise<ITsModule>>(async (file) => {
                    const fullPath = path.resolve(this.options.sourceDir, file);

                    // TS module name is the file path without extension
                    // because we don't add extension to the import statement in the code
                    const moduleName = path.resolve(
                        path.dirname(fullPath),
                        path.basename(fullPath, path.extname(fullPath)),
                    );
                    return {
                        name: moduleName,
                        ast: babelParse(await readFile(fullPath, "utf-8"), getLang(file)),
                    };
                }),
        );
    }

    private findConstEnumDeclarations() {
        for (const { name: moduleName, ast } of this.tsModules) {
            for (const node of ast.body) {
                if (node.type === "TSEnumDeclaration" && node.const) {
                    // const enum CE_XXX { ... }
                    this.constEnumDeclarations.add(`${moduleName}:${node.id.name}`);
                } else if (
                    node.type === "ExportNamedDeclaration" &&
                    node.declaration &&
                    node.declaration.type === "TSEnumDeclaration" &&
                    node.declaration.const
                ) {
                    // export const enum CE_XXX { ... }
                    this.constEnumDeclarations.add(`${moduleName}:${node.declaration.id.name}`);
                }
            }
        }
    }

    private findConstEnumImports() {
        for (const { name: moduleName, ast } of this.tsModules) {
            for (const node of ast.body) {
                if (node.type === "ImportDeclaration" && node.importKind === "value") {
                    // import ... from importedModuleName
                    const importedModuleName = this.getImportedModuleName(node.source.value, moduleName);

                    node.specifiers.forEach((specifier) => {
                        let exportDeclaration: IConstEnumDeclaration | null = null;
                        let importDeclaration: IConstEnumDeclaration | null = null;
                        const localName = specifier.local.name;

                        if (specifier.type === "ImportSpecifier") {
                            // import { CE_XXX } from <importedModuleName>
                            // import { ... as CE_XXX } from <importedModuleName>
                            // import { default as CE_XXX } from <importedModuleName>

                            // It may be not enum, but we will check it weather it is exported as enum later.
                            const importedEnumName =
                                specifier.imported.type === "Identifier"
                                    ? specifier.imported.name
                                    : specifier.imported.value;

                            const declaration: IConstEnumDeclaration = `${importedModuleName}:${importedEnumName}`;

                            // Check if the imported symbols is export in the importedModule as const enum
                            if (this.constEnumExports.has(declaration)) {
                                importDeclaration = `${moduleName}:${localName}`;
                                exportDeclaration = this.constEnumExports.get(declaration)!;
                            }
                        } else if (specifier.type === "ImportDefaultSpecifier") {
                            // import CE_XXX from <importedModuleName>

                            // It may be not enum, but we will check it weather it is default exported in the importedModule as enum later.
                            const declaration: IConstEnumDeclaration = `${importedModuleName}:default`;

                            // Check if the imported symbols is default export as const enum
                            if (this.constEnumExports.has(declaration)) {
                                importDeclaration = `${moduleName}:${localName}`;
                                exportDeclaration = this.constEnumExports.get(declaration)!;
                            }
                        }

                        // Create a relation between the imported declaration and the exported declaration
                        if (importDeclaration && exportDeclaration) {
                            this.constEnumImports.set(importDeclaration, exportDeclaration);
                        }
                    });
                }
            }
        }
    }

    private findConstEnumExports() {
        for (const { name: moduleName, ast } of this.tsModules) {
            for (const node of ast.body) {
                if (node.type === "ExportNamedDeclaration") {
                    // export ...
                    if (node.declaration?.type === "TSEnumDeclaration") {
                        // export const enum CE_XXX { ... }
                        const enumName = node.declaration.id.name;
                        const declaration: IConstEnumDeclaration = `${moduleName}:${enumName}`;

                        if (this.constEnumDeclarations.has(declaration)) {
                            // CE_XXX is declared in the same file
                            this.constEnumExports.set(declaration, declaration);
                        } else if (this.constEnumImports.has(declaration)) {
                            // CE_XXX is imported from another file
                            this.constEnumExports.set(declaration, this.constEnumImports.get(declaration)!);
                        }
                    } else if (!node.declaration) {
                        // export { ... }
                        // export { ... } from ...

                        if (node.source) {
                            // export { CE_XXX } from <importedModuleName>
                            // export { ... as CE_XXX } <importedModuleName>
                            // export { default as CE_XXX } <importedModuleName>
                            const importedModuleName = this.getImportedModuleName(node.source.value, moduleName);

                            node.specifiers.forEach((specifier) => {
                                if (specifier.type === "ExportSpecifier") {
                                    const exportedName =
                                        specifier.exported.type === "Identifier"
                                            ? specifier.exported.name
                                            : specifier.exported.value;
                                    const locale = specifier.local.name;

                                    const importDeclaration: IConstEnumDeclaration = `${importedModuleName}:${locale}`;
                                    const exportDeclaration: IConstEnumDeclaration = `${moduleName}:${exportedName}`;

                                    // Check if the imported symbols is export in the importedModule as const enum
                                    if (this.constEnumExports.has(importDeclaration)) {
                                        this.constEnumExports.set(
                                            exportDeclaration,
                                            this.constEnumExports.get(importDeclaration)!,
                                        );
                                    }
                                }
                            });
                        } else {
                            // export { CE_XXX }
                            // export { ... as CE_XXX }
                            node.specifiers.forEach((specifier) => {
                                if (specifier.type === "ExportSpecifier") {
                                    const exportedName =
                                        specifier.exported.type === "Identifier"
                                            ? specifier.exported.name
                                            : specifier.exported.value;
                                    const locale = specifier.local.name;
                                    const localDeclaration = `${moduleName}:${locale}` as const;
                                    const exportDeclaration = `${moduleName}:${exportedName}` as const;

                                    if (this.constEnumDeclarations.has(localDeclaration)) {
                                        // CE_XXX is declared in the same file
                                        this.constEnumExports.set(exportDeclaration, localDeclaration);
                                    } else if (this.constEnumImports.has(localDeclaration)) {
                                        // CE_XXX is imported from another file
                                        this.constEnumExports.set(
                                            exportDeclaration,
                                            this.constEnumImports.get(localDeclaration)!,
                                        );
                                    }
                                }
                            });
                        }
                    }
                } else if (node.type === "ExportDefaultDeclaration" && node.declaration.type === "Identifier") {
                    // export default CE_XXX
                    const enumName = node.declaration.name;
                    const declaration: IConstEnumDeclaration = `${moduleName}:${enumName}`;
                    if (this.constEnumDeclarations.has(declaration)) {
                        // CE_XXX is declared in the same file
                        this.constEnumExports.set(`${moduleName}:default`, declaration);
                    } else if (this.constEnumImports.has(declaration)) {
                        // CE_XXX is imported from another file
                        this.constEnumExports.set(`${moduleName}:default`, this.constEnumImports.get(declaration)!);
                    }
                }
            }
        }
    }

    private findConstEnumDefinitions() {
        for (const { name: moduleName, ast } of this.tsModules) {
            for (const node of ast.body) {
                let constEnumNode: TSEnumDeclaration | null = null;

                if (node.type === "TSEnumDeclaration" && node.const) {
                    // const enum CE_XXX { ... }
                    constEnumNode = node;
                } else if (
                    node.type === "ExportNamedDeclaration" &&
                    node.declaration &&
                    node.declaration.type === "TSEnumDeclaration" &&
                    node.declaration.const
                ) {
                    // export const enum CE_XXX { ... }
                    constEnumNode = node.declaration;
                }

                // Not a const enum, skip
                if (!constEnumNode) {
                    continue;
                }

                const enumName = constEnumNode.id.name;
                const declaration: IConstEnumDeclaration = `${moduleName}:${enumName}`;

                let prevItemInitialized = false;
                let itemIndex = 0;

                for (const member of constEnumNode.members) {
                    const memberName = member.id.type === "Identifier" ? member.id.name : member.id.value;
                    let value: string | number | boolean | null;

                    const definitionIdentifier: IConstEnumDefinitionIdentifier = `${declaration}.${memberName}`;

                    // Skip if already defined
                    if (this.constEnumDefinitions.has(definitionIdentifier)) {
                        continue;
                    }

                    // Prepare an error class for unsupported member type
                    class UnsupportedMemberTypeError extends TypeError {
                        constructor() {
                            super(
                                `Const enum member "${enumName}.${memberName}" in module ${moduleName} has unsupported type.`,
                            );
                        }
                    }

                    if (member.initializer) {
                        prevItemInitialized = true;

                        // The current item have been initialized, calculate the value
                        value = this.evaluateExpression(member.initializer, moduleName, UnsupportedMemberTypeError);

                        if (value === null) {
                            // Skip this iteration until the next iteration
                            continue;
                        }
                    } else {
                        // If the previous item have been initialized, the current item must have initializer.
                        if (prevItemInitialized) {
                            throw new TypeError(`Enum member ${enumName}.${memberName} must have initializer.`);
                        }

                        // The current item have not been initialized, use the index as the value
                        value = itemIndex;
                    }

                    this.constEnumDefinitions.set(definitionIdentifier, JSON.stringify(value));
                    itemIndex++;
                }
            }
        }
    }

    private getImportedModuleName(importedModuleName: string, currentModuleName: IModuleName): IModuleName {
        if (importedModuleName.startsWith(".")) {
            // relative path
            return path.resolve(path.dirname(currentModuleName), importedModuleName);
        } else if (importedModuleName.startsWith("/")) {
            // absolute path
            return importedModuleName;
        } else {
            // tsConfigPaths
            return (
                // ignore file exists check
                this.tsConfigMatchPath(importedModuleName, undefined /* readJson */, () => true /* fileExists */) ??
                importedModuleName
            );
        }
    }

    private getConstEnumRootDeclaration(declaration: IConstEnumDeclaration): IConstEnumDeclaration | null {
        // if the declaration is imported from another file, replace it with the exported declaration
        if (this.constEnumImports.has(declaration)) {
            declaration = this.constEnumImports.get(declaration)!;
        }

        while (true) {
            const parentDeclaration = this.constEnumExports.get(declaration)!;

            // if the parent declaration is not found, there are no root declaration
            if (!parentDeclaration) {
                return null;
            }

            // if the parent declaration is the same as the current declaration,
            // they are in the same file and it is the root declaration
            if (parentDeclaration === declaration) {
                return declaration;
            }

            declaration = parentDeclaration;
        }
    }

    private evaluateExpression(
        node: Expression | PrivateName,
        moduleName: string,
        UnsupportedMemberTypeError: new () => TypeError,
    ): string | number | boolean | null {
        if (node.type === "NumericLiteral" || node.type === "StringLiteral" || node.type === "BooleanLiteral") {
            // 1, "1", true, false
            return node.value;
        } else if (node.type === "UnaryExpression" && ["-", "+", "~", "!"].includes(node.operator)) {
            const value = this.evaluateExpression(node.argument, moduleName, UnsupportedMemberTypeError);

            // Skip if the argument is not defined, skip this iteration until the next iteration if it is defined
            if (value === null) {
                return null;
            }

            return this.evaluateConstExpression(`${node.operator} ${JSON.stringify(value)}`);
        } else if (node.type === "BinaryExpression") {
            return this.evaluateBinaryExpression(node, moduleName, UnsupportedMemberTypeError);
        } else if (
            node.type === "MemberExpression" &&
            node.object.type === "Identifier" &&
            node.property.type === "Identifier"
        ) {
            // SomeEnum.SomeMember
            const rootDeclaration = this.getConstEnumRootDeclaration(`${moduleName}:${node.object.name}`);

            // A MemberExpression must be a member of a const enum
            if (!rootDeclaration) {
                throw new UnsupportedMemberTypeError();
            }

            const definitionIdentifier: IConstEnumDefinitionIdentifier = `${rootDeclaration}.${node.property.name}`;

            // Skip if the member is not defined, skip this iteration until the next iteration if it is defined
            if (!this.constEnumDefinitions.has(definitionIdentifier)) {
                return null;
            }

            return this.evaluateConstExpression(this.constEnumDefinitions.get(definitionIdentifier)!);
        } else {
            throw new UnsupportedMemberTypeError();
        }
    }

    private evaluateBinaryExpression(
        binExp: BinaryExpression,
        moduleName: string,
        UnsupportedMemberTypeError: new () => TypeError,
    ): string | number | boolean | null {
        const { left, right, operator } = binExp;
        const leftValue = this.evaluateExpression(left, moduleName, UnsupportedMemberTypeError);
        if (leftValue === null) {
            return null;
        }

        const rightValue = this.evaluateExpression(right, moduleName, UnsupportedMemberTypeError);
        if (rightValue === null) {
            return null;
        }

        return this.evaluateConstExpression(`${JSON.stringify(leftValue)} ${operator} ${JSON.stringify(rightValue)}`);
    }

    private evaluateConstExpression(express: string): string | number | boolean {
        return new Function(`return ${express}`)();
    }
}
