import { requestAsync } from "../request";
import type { ISessionInfoGetResponse } from "./auth.types";

export async function getSessionInfoAsync() {
    return await requestAsync<ISessionInfoGetResponse>({
        path: "auth/session-info",
        method: "GET",
    });
}
