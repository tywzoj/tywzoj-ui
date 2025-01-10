export interface IFeature {
    readonly recaptcha: boolean;
    readonly emailVerification: boolean;
    readonly renderMarkdownInUserListBio: boolean;
    readonly renderMarkdownInUserBio: boolean;
}

export interface IPagination {
    readonly homepageUserList: number;
    readonly homepageContest: number;
    readonly homepageHomework: number;
    readonly problem: number;
    readonly problemSet: number;
    readonly submission: number;
    readonly submissionStatistic: number;
    readonly homework: number;
    readonly contest: number;
    readonly userList: number;
}

export interface IClientConfig {
    readonly siteName: string;
    readonly domainIcpRecordInformation?: string | null;
    readonly recaptchaSiteKey?: string | null;
    readonly useRecaptchaNet?: boolean | null;
    readonly feature: IFeature;
    readonly pagination: IPagination;
}
