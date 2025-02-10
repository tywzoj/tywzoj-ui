import type { TSEnumDeclaration } from "@babel/types";
import { babelParse, getLang, isTs } from "ast-kit";
import type { Pattern } from "fast-glob";
import fg from "fast-glob";
import { readFileSync } from "fs";
import path from "path";
import tsConfigPaths from "tsconfig-paths";
import type { Plugin } from "vite";

export interface IInlineConstEnumOptions {
    sourceDir: string;
    filePattern: Pattern;
    tsConfigPath: string;
}

export default function inlineConstEnum(options: IInlineConstEnumOptions): Plugin {
    const instance = new InlineConstEnum(options);
    const replacements = instance.getFileReplacement();

    return {
        name: "vite:plugin-inline-const-enum",
        enforce: "pre",
        load(id) {
            if (id.includes("node_modules")) {
                return null;
            }

            const idWithoutSearch = id.split("?")[0];

            if (idWithoutSearch in replacements) {
                let code = readFileSync(id, "utf-8");

                for (const [enumItem, value] of Object.entries(replacements[idWithoutSearch])) {
                    code = code.replaceAll(enumItem, value);
                }

                return code;
            } else {
                return null;
            }
        },
    };
}

interface ITsFile {
    pathWithoutExt: string;
    ast: ReturnType<typeof babelParse>;
}
type IConstEnumDeclaration = `${string}:${string}`; // filePath:enumName
type IConstEnumImports = Map<IConstEnumDeclaration, IConstEnumDeclaration>;
type IConstEnumExports = Map<IConstEnumDeclaration, IConstEnumDeclaration>;
type IConstEnumDefinitionIdentifier = `${IConstEnumDeclaration}.${string}`; // filePath:enumName.memberName
type IConstEnumDefinitions = Map<IConstEnumDefinitionIdentifier, string>;

class InlineConstEnum {
    private tsConfigMatchPath: tsConfigPaths.MatchPath;

    private tsFiles: ITsFile[] = [];
    private fullPathMap: Map<string, string> = new Map();
    private constEnumDeclarations: Set<IConstEnumDeclaration> = new Set();
    private constEnumImports: IConstEnumImports = new Map();
    private constEnumExports: IConstEnumExports = new Map();
    private constEnumDefinitions: IConstEnumDefinitions = new Map();

    constructor(private options: IInlineConstEnumOptions) {
        const result = tsConfigPaths.loadConfig(options.tsConfigPath);

        if (result.resultType === "failed") {
            throw new Error(result.message);
        }

        this.tsConfigMatchPath = tsConfigPaths.createMatchPath(result.absoluteBaseUrl, result.paths);

        this.findAndReadTsFiles(this.options);
        this.findConstEnumDeclarations();

        this.findConstEnumExports();

        while (true) {
            const prevConstEnumExportsSize = this.constEnumExports.size;
            this.findConstEnumImports();
            this.findConstEnumExports();
            const nextConstEnumExportsSize = this.constEnumExports.size;

            if (prevConstEnumExportsSize === nextConstEnumExportsSize) {
                break;
            }
        }

        while (true) {
            const prevConstEnumImportsSize = this.constEnumImports.size;
            this.findConstEnumImports();
            const nextConstEnumImportsSize = this.constEnumImports.size;

            if (prevConstEnumImportsSize === nextConstEnumImportsSize) {
                break;
            }
        }

        while (true) {
            const prevConstEnumDefinitionsSize = this.constEnumDefinitions.size;
            this.findConstEnumDefinitions();
            const nextConstEnumDefinitionsSize = this.constEnumDefinitions.size;

            if (prevConstEnumDefinitionsSize === nextConstEnumDefinitionsSize) {
                break;
            }
        }
    }

    private findAndReadTsFiles(options: IInlineConstEnumOptions) {
        this.tsFiles = fg
            .sync(`**/*.{ts,cts,mts,tsx}`, {
                cwd: options.sourceDir,
            })
            .map((file) => path.resolve(options.sourceDir, file))
            .map((path) => ({ path, lang: getLang(path) }))
            .filter((file) => isTs(file.lang))
            .map((file) => {
                const pathWithoutExt = path.resolve(
                    path.dirname(file.path),
                    path.basename(file.path, path.extname(file.path)),
                );
                this.fullPathMap.set(pathWithoutExt, file.path);
                return {
                    pathWithoutExt,
                    ast: babelParse(readFileSync(file.path, "utf-8"), file.lang),
                };
            });
    }

    private findConstEnumDeclarations() {
        for (const { pathWithoutExt, ast } of this.tsFiles) {
            for (const node of ast.body) {
                if (node.type === "TSEnumDeclaration" && node.const) {
                    this.constEnumDeclarations.add(`${pathWithoutExt}:${node.id.name}`);
                } else if (
                    node.type === "ExportNamedDeclaration" &&
                    node.declaration &&
                    node.declaration.type === "TSEnumDeclaration" &&
                    node.declaration.const
                ) {
                    this.constEnumDeclarations.add(`${pathWithoutExt}:${node.declaration.id.name}`);
                }
            }
        }
    }

    private findConstEnumImports() {
        for (const { pathWithoutExt, ast } of this.tsFiles) {
            for (const node of ast.body) {
                if (node.type === "ImportDeclaration") {
                    // import ...
                    const importPath = this.getImportPath(node.source.value, pathWithoutExt);
                    if (!importPath) {
                        continue;
                    }

                    node.specifiers.forEach((specifier) => {
                        let fromDeclaration: IConstEnumDeclaration | null = null;
                        let importedDeclaration: IConstEnumDeclaration | null = null;
                        const localName = specifier.local.name;

                        if (specifier.type === "ImportSpecifier") {
                            // import { CE_XXX } from ...
                            // import { ... as CE_XXX } from ...
                            // import { default as CE_XXX } from ...
                            const importedName =
                                specifier.imported.type === "Identifier"
                                    ? specifier.imported.name
                                    : specifier.imported.value;

                            const declaration = `${importPath}:${importedName}` as const;

                            if (this.constEnumExports.has(declaration)) {
                                importedDeclaration = `${pathWithoutExt}:${localName}` as const;
                                fromDeclaration = this.constEnumExports.get(declaration)!;
                            }
                        } else if (specifier.type === "ImportDefaultSpecifier") {
                            // import CE_XXX from ...
                            const declaration = `${importPath}:default` as const;

                            if (this.constEnumExports.has(declaration)) {
                                importedDeclaration = `${pathWithoutExt}:${localName}` as const;
                                fromDeclaration = this.constEnumExports.get(declaration)!;
                            }
                        }

                        if (fromDeclaration && importedDeclaration) {
                            this.constEnumImports.set(importedDeclaration, fromDeclaration);
                        }
                    });
                }
            }
        }
    }

    private findConstEnumExports() {
        for (const { pathWithoutExt, ast } of this.tsFiles) {
            for (const node of ast.body) {
                if (node.type === "ExportNamedDeclaration") {
                    // export ...
                    if (node.declaration?.type === "TSEnumDeclaration") {
                        // export const enum CE_XXX = { ... }
                        const enumName = node.declaration.id.name;
                        const declaration = `${pathWithoutExt}:${enumName}` as const;
                        if (this.constEnumDeclarations.has(declaration)) {
                            this.constEnumExports.set(declaration, declaration);
                        } else if (this.constEnumImports.has(declaration)) {
                            this.constEnumExports.set(declaration, this.constEnumImports.get(declaration)!);
                        }
                    } else if (!node.declaration) {
                        // export { ... }
                        // export { ... } from ...

                        if (node.source) {
                            // export { CE_XXX } from ...
                            // export { ... as CE_XXX } ...
                            // export { default as CE_XXX } ...
                            const importPath = this.getImportPath(node.source.value, pathWithoutExt);

                            node.specifiers.forEach((specifier) => {
                                if (specifier.type === "ExportSpecifier") {
                                    const exportedName =
                                        specifier.exported.type === "Identifier"
                                            ? specifier.exported.name
                                            : specifier.exported.value;
                                    const locale = specifier.local.name;
                                    const importDeclaration = `${importPath}:${locale}` as const;
                                    const exportDeclaration = `${pathWithoutExt}:${exportedName}` as const;

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
                                    const localDeclaration = `${pathWithoutExt}:${locale}` as const;
                                    const exportDeclaration = `${pathWithoutExt}:${exportedName}` as const;

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
                    const declaration = `${pathWithoutExt}:${enumName}` as const;
                    if (this.constEnumDeclarations.has(declaration)) {
                        // CE_XXX is declared in the same file
                        this.constEnumExports.set(`${pathWithoutExt}:default`, declaration);
                    } else if (this.constEnumImports.has(declaration)) {
                        // CE_XXX is imported from another file
                        this.constEnumExports.set(`${pathWithoutExt}:default`, this.constEnumImports.get(declaration)!);
                    }
                }
            }
        }
    }

    private findConstEnumDefinitions() {
        for (const { pathWithoutExt, ast } of this.tsFiles) {
            for (const node of ast.body) {
                let constEnumNode: TSEnumDeclaration | null = null;
                if (node.type === "TSEnumDeclaration" && node.const) {
                    constEnumNode = node;
                } else if (
                    node.type === "ExportNamedDeclaration" &&
                    node.declaration &&
                    node.declaration.type === "TSEnumDeclaration" &&
                    node.declaration.const
                ) {
                    constEnumNode = node.declaration;
                }
                if (!constEnumNode) {
                    continue;
                }

                const enumName = constEnumNode.id.name;
                const declaration = `${pathWithoutExt}:${enumName}` as const;

                let prevItemInitialized = false;
                let itemIndex = 0;

                for (const member of constEnumNode.members) {
                    const memberName = member.id.type === "Identifier" ? member.id.name : member.id.value;
                    let value: string;

                    const definitionIdentifier = `${declaration}.${memberName}` as const;

                    if (this.constEnumDefinitions.has(definitionIdentifier)) {
                        continue;
                    }

                    class UnsupportedMemberTypeError extends TypeError {
                        constructor() {
                            super(`Unsupported member type in ${enumName}.${memberName}`);
                        }
                    }

                    if (member.initializer) {
                        prevItemInitialized = true;
                        const initializer = member.initializer;

                        if (initializer.type === "NumericLiteral" || initializer.type === "StringLiteral") {
                            // "A" or '1
                            value = JSON.stringify(initializer.value);
                        } else if (initializer.type === "UnaryExpression") {
                            const arg = initializer.argument;
                            if (
                                (arg.type === "NumericLiteral" || arg.type === "StringLiteral") &&
                                ["-", "+", "~", "!"].includes(initializer.operator)
                            ) {
                                // -1, +1, ~1, !1, -"1", +"1", ~"1", !"1"
                                value = `${initializer.operator}${JSON.stringify(arg.value)}`;
                            } else {
                                throw new UnsupportedMemberTypeError();
                            }
                        } else if (initializer.type === "MemberExpression") {
                            // SomeEnum.SomeMember
                            if (
                                initializer.object.type === "Identifier" &&
                                initializer.property.type === "Identifier"
                            ) {
                                const rootDeclaration = this.getConstEnumRootDeclaration(
                                    `${pathWithoutExt}:${initializer.object.name}` as const,
                                );

                                if (!rootDeclaration) {
                                    throw new UnsupportedMemberTypeError();
                                }

                                const memberDeclaration = `${rootDeclaration}.${initializer.property.name}` as const;
                                if (!this.constEnumDefinitions.has(memberDeclaration)) {
                                    continue;
                                }

                                value = this.constEnumDefinitions.get(memberDeclaration)!;
                            } else {
                                throw new UnsupportedMemberTypeError();
                            }
                        } else {
                            throw new UnsupportedMemberTypeError();
                        }
                    } else {
                        if (prevItemInitialized) {
                            throw new TypeError(`Enum member ${enumName}.${memberName} must have initializer.`);
                        }
                        value = itemIndex.toString(10);
                    }

                    this.constEnumDefinitions.set(definitionIdentifier, value);
                    itemIndex++;
                }
            }
        }
    }

    private getImportPath(importPath: string, filePath: string) {
        if (importPath.startsWith(".")) {
            return path.resolve(path.dirname(filePath), importPath);
        } else if (importPath.startsWith("/")) {
            return importPath;
        } else {
            return this.tsConfigMatchPath(importPath, undefined, undefined, ["ts", "cts", "mts", "tsx"]) ?? importPath;
        }
    }

    private getConstEnumRootDeclaration(declaration: IConstEnumDeclaration): IConstEnumDeclaration | null {
        if (this.constEnumImports.has(declaration)) {
            declaration = this.constEnumImports.get(declaration)!;
        }

        while (true) {
            const parentDeclaration = this.constEnumExports.get(declaration)!;
            if (!parentDeclaration) {
                return null;
            }
            if (parentDeclaration === declaration) {
                return declaration;
            }
            declaration = parentDeclaration;
        }
    }

    public getFileReplacement(): Record<string, Record<`${string}.${string}`, string>> {
        const replacements: Record<string, Record<`${string}.${string}`, string>> = {};

        const imports = Array.from(this.constEnumImports.keys());

        const fileNameDefinitions = Array.from(this.constEnumDefinitions.keys()).reduce<{
            [pathWithoutExt: string]: `${string}.${string}`[];
        }>((acc, definition) => {
            const [pathWithoutExt, enumItem] = definition.split(":") as [string, `${string}.${string}`];
            if (!acc[pathWithoutExt]) {
                acc[pathWithoutExt] = [];
            }
            acc[pathWithoutExt].push(enumItem);

            return acc;
        }, {});

        for (const importDeclaration of imports) {
            const [pathWithoutExt] = importDeclaration.split(":") as [string, string];
            const filePath = this.fullPathMap.get(pathWithoutExt);

            if (!filePath) {
                continue;
            }

            if (!replacements[filePath]) {
                replacements[filePath] = {};
            }

            const rootDeclaration = this.getConstEnumRootDeclaration(importDeclaration);

            if (!rootDeclaration) {
                continue;
            }

            const [pathWithoutExt2] = rootDeclaration.split(":") as [string, string];

            const definitions = fileNameDefinitions[pathWithoutExt2];

            if (!definitions) {
                continue;
            }

            for (const definition of definitions) {
                const value = this.constEnumDefinitions.get(`${pathWithoutExt2}:${definition}`);
                if (!value) {
                    continue;
                }
                replacements[filePath][definition] = value;
            }
        }

        return replacements;
    }
}
