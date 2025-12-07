export interface ISignedUploadRequest {
    readonly uuid: string;
    readonly method: "POST" | "PUT";
    readonly url: string;
    readonly token: string;
    readonly extraFormData?: unknown;
    readonly fileFieldName?: "file";
}
