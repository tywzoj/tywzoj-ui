export const enum CE_CodeLanguage {
    Cpp = "cpp",
    C = "c",
    Java = "java",
    Kotlin = "kotlin",
    Pascal = "pascal",
    Python = "python",
    Rust = "rust",
    Swift = "swift",
    Go = "go",
    Haskell = "haskell",
    CSharp = "csharp",
    FSharp = "fsharp",
}

export interface ICodeLanguageOptionValue {
    lsFn?: (ls: ILocalizedStrings) => string;
    option: string;
}

export interface ICodeLanguageOption {
    lsFn?: (ls: ILocalizedStrings) => string;
    name: "compiler" | "std" | "O" | "m" | "version" | "optimize" | "platform";
    options: ICodeLanguageOptionValue[];
    default: string;
}
