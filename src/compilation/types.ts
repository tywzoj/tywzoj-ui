import type { CE_Strings } from "@/locales/types";

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
    string?: CE_Strings;
    option: string;
}

export interface ICodeLanguageOption {
    string?: CE_Strings;
    name: "compiler" | "std" | "O" | "m" | "version" | "optimize" | "platform";
    options: ICodeLanguageOptionValue[];
    default: string;
}
