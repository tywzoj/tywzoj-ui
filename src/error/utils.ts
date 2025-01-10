export function showErrorPage(error?: Error) {
    document.getElementById("error-box-stack")!.innerText = error?.stack || error?.message || "";
    if (error) {
        console.error(error);
    }
    document.getElementById("error-box")!.style.display = "";
}

export function hideErrorPage() {
    document.getElementById("error-box")!.style.display = "none";
}
