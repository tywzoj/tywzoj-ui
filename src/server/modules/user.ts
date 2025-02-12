import { requestAsync } from "../request";
import type { IUserDetailGetResponse } from "./user.types";

export async function getUserDetailAsync(id: string) {
    return await requestAsync<IUserDetailGetResponse>({
        path: `user/detail/${id}`,
        method: "GET",
    });
}
