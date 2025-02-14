export function isProduction(): boolean {
    return import.meta.env.MODE === "production";
}

export function isDevelopment(): boolean {
    return import.meta.env.MODE === "development";
}

export function envApiEndpoint(): string {
    return new URL(import.meta.env.TYWZOJ_API_END_POINT, window.location.href).href;
}
