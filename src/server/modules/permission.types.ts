export interface ICommonPermission {
    readonly manageUser: boolean;
    readonly manageProblem: boolean;
    readonly accessHomework: boolean;
    readonly accessContest: boolean;
    readonly accessProblem: boolean;
    readonly accessSite: boolean;
    readonly submitAnswer: boolean;
}

export interface IPermission extends ICommonPermission {
    readonly signUp: boolean;
}
