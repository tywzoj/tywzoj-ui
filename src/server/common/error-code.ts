/* eslint-disable @typescript-eslint/naming-convention */

// Attention!
// Do NOT modify the existing code.
export const enum CE_ErrorCode {
    // Global
    OK = 0,
    Unknown = 1000,
    SignInRequired = 1001,
    PermissionDenied = 1002,
    ServerError = 1003,
    RecaptchaError = 1004,
    ValidationError = 1005,
    TakeTooMany = 1006,
    RateLimitExceeded = 1007,
    HttpsRequired = 1008,
    EmailVerificationCodeRateLimited = 1009,
    InvalidEmailVerificationCode = 1010,

    // Auth (20xx)
    Auth_NoSuchUser = 2000,
    Auth_WrongPassword = 2001,
    Auth_DuplicateUsername = 2002,
    Auth_DuplicateEmail = 2003,

    // User (21xx)
    User_NoSuchUser = 2100,
    User_DuplicateUsername = 2101,

    // Problem (22xx)
    Problem_NoSuchProblem = 2200,
    Problem_InvalidFileUploadToken = 2201,
    Problem_TooManyFileUploadRequest = 2203,
    Problem_TooLargeUploadFile = 2204,
    Problem_FileLimitExceeded = 2205,
    Problem_NoSuchProblemFile = 2206,
    Problem_DuplicateDisplayId = 2207,

    // File (23xx)
    File_DuplicateUUID = 2300,
    File_NotUploaded = 2301,
    File_InvalidToken = 2302,

    // Client Only (9xxx)
    Client_FileUploadFailed = 9000,
    Client_InvalidUploadMethod = 9001,
}
