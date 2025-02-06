import DOMPurify from "dompurify";

const defaultAllowTags = [
    "a",
    "b",
    "i",
    "u",
    "em",
    "strong",
    "small",
    "mark",
    "abbr",
    "code",
    "pre",
    "blockquote",
    "ol",
    "ul",
    "li",
    "br",
    "p",
    "hr",
    "div",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "caption",
];

const defaultAllowAttrs = ["href", "title", "width", "height", "target", "style", "data-id"];

export function sanitize(html: string, removeImage = false): string {
    const result = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: removeImage ? defaultAllowTags : [...defaultAllowTags, "img"],
        ALLOWED_ATTR: removeImage ? defaultAllowAttrs : [...defaultAllowAttrs, "alt", "src"],
    });

    return result;
}
