export const enum CE_UserLevel {
    Admin = 100, // Someone that can manage anything
    Manager = 90, // Someone that can manage settings except security related
    Internal = 50, // Internal user (students)
    Paid = 30, // External paid user
    General = 1,
    Specific = 0, // Specific user, check permission in specific case
    Disabled = -1,
}

export const enum CE_CommonPermission {
    // Manage permissions
    ManageUser = CE_UserLevel.Admin,
    ManageProblem = CE_UserLevel.Manager,

    // Access permissions
    AccessHomework = CE_UserLevel.Internal,
    AccessContest = CE_UserLevel.Paid,
    AccessProblem = CE_UserLevel.General,
    AccessSite = CE_UserLevel.General,

    // Special permissions
    SubmitAnswer = CE_UserLevel.Paid,
}

export const enum CE_SpecificPermission {
    Problem,
    Contest,
}

export const enum CE_Visibility {
    Public = CE_UserLevel.General,
    Paid = CE_UserLevel.Paid,
    Internal = CE_UserLevel.Internal,
    Private = CE_UserLevel.Manager,
}
