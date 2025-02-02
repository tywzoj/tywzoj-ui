export function removeUrlEndSlash(url: string): string {
    while (url.endsWith("/")) {
        url = url.slice(0, -1);
    }

    return url;
}

export function parseUrlIfSameOrigin(href: string) {
    // `new URL` may throw an exception
    try {
        const url = new URL(href, document.location.href);
        // Check internal links
        if (url.origin === document.location.origin) {
            return url;
        }
    } catch {}
    return null;
}
