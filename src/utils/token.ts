import { getLocalStorage } from "./safe-storage";

const TOKEN_KEY = "api_token";

export function getApiToken() {
    return getLocalStorage().getItem(TOKEN_KEY);
}

export function setApiToken(token: string) {
    getLocalStorage().setItem(TOKEN_KEY, token);
}
