import { CE_Strings } from "@/locales/types";

import type { ICodeLanguageOption } from "./types";
import { CE_CodeLanguage } from "./types";

export const codeLanguageExtMap: Record<CE_CodeLanguage, `.${string}`[]> = {
    [CE_CodeLanguage.Cpp]: [".cpp", ".cc", ".cxx"],
    [CE_CodeLanguage.C]: [".c"],
    [CE_CodeLanguage.Java]: [".java"],
    [CE_CodeLanguage.Kotlin]: [".kt"],
    [CE_CodeLanguage.Pascal]: [".pas"],
    [CE_CodeLanguage.Python]: [".py"],
    [CE_CodeLanguage.Rust]: [".rs"],
    [CE_CodeLanguage.Swift]: [".swift"],
    [CE_CodeLanguage.Go]: [".go"],
    [CE_CodeLanguage.Haskell]: [".hs"],
    [CE_CodeLanguage.CSharp]: [".cs"],
    [CE_CodeLanguage.FSharp]: [".fs"],
};

export const codeLanguageOptions: Record<CE_CodeLanguage, ICodeLanguageOption[]> = {
    [CE_CodeLanguage.Cpp]: [
        {
            name: "compiler",
            options: [
                { option: "g++", string: CE_Strings.COMPILATION_CPP_COMPILER_GCC },
                { option: "clang++", string: CE_Strings.COMPILATION_CPP_COMPILER_CLANG },
            ],
            default: "g++",
            string: CE_Strings.COMPILATION_COMPILER_LABEL,
        },
        {
            name: "std",
            options: [
                { option: "c++03", string: CE_Strings.COMPILATION_CPP_STD_ISO_03 },
                { option: "c++11", string: CE_Strings.COMPILATION_CPP_STD_ISO_11 },
                { option: "c++14", string: CE_Strings.COMPILATION_CPP_STD_ISO_14 },
                { option: "c++17", string: CE_Strings.COMPILATION_CPP_STD_ISO_17 },
                { option: "c++20", string: CE_Strings.COMPILATION_CPP_STD_ISO_20 },
                { option: "gnu++03", string: CE_Strings.COMPILATION_CPP_STD_GNU_03 },
                { option: "gnu++11", string: CE_Strings.COMPILATION_CPP_STD_GNU_11 },
                { option: "gnu++14", string: CE_Strings.COMPILATION_CPP_STD_GNU_14 },
                { option: "gnu++17", string: CE_Strings.COMPILATION_CPP_STD_GNU_17 },
                { option: "gnu++20", string: CE_Strings.COMPILATION_CPP_STD_GNU_20 },
            ],
            default: "c++14",
            string: CE_Strings.COMPILATION_STD_LABEL,
        },
        {
            name: "O",
            options: [
                { option: "0", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O0 },
                { option: "1", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O1 },
                { option: "2", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O2 },
                { option: "3", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O3 },
                { option: "fast", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_OFAST },
            ],
            default: "0",
            string: CE_Strings.COMPILATION_OPTIMIZATION_LABEL,
        },
        {
            name: "m",
            options: [
                { option: "32", string: CE_Strings.COMPILATION_CPP_ARCHITECTURE_32 },
                { option: "64", string: CE_Strings.COMPILATION_CPP_ARCHITECTURE_64 },
                { option: "x32", string: CE_Strings.COMPILATION_CPP_ARCHITECTURE_X32 },
            ],
            default: "64",
            string: CE_Strings.COMPILATION_ARCHITECTURE_LABEL,
        },
    ],
    [CE_CodeLanguage.C]: [
        {
            name: "compiler",
            options: [
                { option: "gcc", string: CE_Strings.COMPILATION_C_COMPILER_GCC },
                { option: "clang", string: CE_Strings.COMPILATION_C_COMPILER_CLANG },
            ],
            default: "gcc",
            string: CE_Strings.COMPILATION_COMPILER_LABEL,
        },
        {
            name: "std",
            options: [
                { option: "c89", string: CE_Strings.COMPILATION_C_STD_ISO_89 },
                { option: "c99", string: CE_Strings.COMPILATION_C_STD_ISO_99 },
                { option: "c11", string: CE_Strings.COMPILATION_C_STD_ISO_11 },
                { option: "c17", string: CE_Strings.COMPILATION_C_STD_ISO_17 },
                { option: "gnu89", string: CE_Strings.COMPILATION_C_STD_GNU_89 },
                { option: "gnu99", string: CE_Strings.COMPILATION_C_STD_GNU_99 },
                { option: "gnu11", string: CE_Strings.COMPILATION_C_STD_GNU_11 },
                { option: "gnu17", string: CE_Strings.COMPILATION_C_STD_GNU_17 },
            ],
            default: "c11",
            string: CE_Strings.COMPILATION_STD_LABEL,
        },
        {
            name: "O",
            options: [
                { option: "0", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O0 },
                { option: "1", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O1 },
                { option: "2", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O2 },
                { option: "3", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O3 },
                { option: "fast", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_OFAST },
            ],
            default: "0",
            string: CE_Strings.COMPILATION_OPTIMIZATION_LABEL,
        },
        {
            name: "m",
            options: [
                { option: "32", string: CE_Strings.COMPILATION_CPP_ARCHITECTURE_32 },
                { option: "64", string: CE_Strings.COMPILATION_CPP_ARCHITECTURE_64 },
                { option: "x32", string: CE_Strings.COMPILATION_CPP_ARCHITECTURE_X32 },
            ],
            default: "64",
            string: CE_Strings.COMPILATION_ARCHITECTURE_LABEL,
        },
    ],
    [CE_CodeLanguage.Java]: [],
    [CE_CodeLanguage.Kotlin]: [
        {
            name: "version",
            options: [{ option: "1.5" }, { option: "1.6" }, { option: "1.7" }, { option: "1.8" }, { option: "1.9" }],
            default: "1.8",
            string: CE_Strings.COMPILATION_VERSION_LABEL,
        },
        {
            name: "platform",
            options: [{ option: "jvm", string: CE_Strings.COMPILATION_KT_PLATFORM_JVM }],
            default: "jvm",
            string: CE_Strings.COMPILATION_PLATFORM_LABEL,
        },
    ],
    [CE_CodeLanguage.Pascal]: [
        {
            name: "optimize",
            options: [
                { option: "-", string: CE_Strings.COMPILATION_OPTIMIZATION_DISABLED },
                { option: "1", string: CE_Strings.COMPILATION_PAS_OPTIMIZATION_O },
                { option: "2", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O2 },
                { option: "3", string: CE_Strings.COMPILATION_CPP_OPTIMIZATION_O3 },
                { option: "4", string: CE_Strings.COMPILATION_PAS_OPTIMIZATION_O4 },
            ],
            default: "-",
            string: CE_Strings.COMPILATION_OPTIMIZATION_LABEL,
        },
    ],
    [CE_CodeLanguage.Python]: [
        {
            name: "version",
            options: [{ option: "2.7" }, { option: "3.9" }, { option: "3.10" }],
            default: "3.10",
            string: CE_Strings.COMPILATION_VERSION_LABEL,
        },
    ],
    [CE_CodeLanguage.Rust]: [
        {
            name: "version",
            options: [{ option: "2015" }, { option: "2018" }, { option: "2021" }],
            default: "2021",
            string: CE_Strings.COMPILATION_VERSION_LABEL,
        },
        {
            name: "optimize",
            options: [
                { option: "0", string: CE_Strings.COMPILATION_OPTIMIZATION_DISABLED },
                { option: "1", string: CE_Strings.COMPILATION_RS_OPTIMIZATION_1 },
                { option: "2", string: CE_Strings.COMPILATION_RS_OPTIMIZATION_2 },
                { option: "3", string: CE_Strings.COMPILATION_RS_OPTIMIZATION_3 },
            ],
            default: "0",
            string: CE_Strings.COMPILATION_OPTIMIZATION_LABEL,
        },
    ],
    [CE_CodeLanguage.Swift]: [
        {
            name: "version",
            options: [{ option: "4.2" }, { option: "5" }, { option: "6" }],
            default: "5",
            string: CE_Strings.COMPILATION_VERSION_LABEL,
        },
        {
            name: "optimize",
            options: [
                { option: "Onone", string: CE_Strings.COMPILATION_OPTIMIZATION_DISABLED },
                { option: "O", string: CE_Strings.COMPILATION_SW_OPTIMIZATION_O },
                { option: "Ounchecked", string: CE_Strings.COMPILATION_SW_OPTIMIZATION_O_UNCHECKED },
            ],
            default: "O",
            string: CE_Strings.COMPILATION_OPTIMIZATION_LABEL,
        },
    ],
    [CE_CodeLanguage.Go]: [
        {
            name: "version",
            options: [{ option: "1.x" }],
            default: "1.x",
            string: CE_Strings.COMPILATION_VERSION_LABEL,
        },
    ],
    [CE_CodeLanguage.Haskell]: [
        {
            name: "version",
            options: [
                { option: "98", string: CE_Strings.COMPILATION_HS_VERSION_98 },
                { option: "2010", string: CE_Strings.COMPILATION_HS_VERSION_2010 },
            ],
            default: "2010",
            string: CE_Strings.COMPILATION_VERSION_LABEL,
        },
    ],
    [CE_CodeLanguage.CSharp]: [
        {
            name: "version",
            options: [{ option: "7.3" }, { option: "8" }, { option: "9" }],
            default: "9",
            string: CE_Strings.COMPILATION_VERSION_LABEL,
        },
    ],
    [CE_CodeLanguage.FSharp]: [],
};
