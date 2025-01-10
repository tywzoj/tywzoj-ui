export function showErrorPage(error?: Error) {
    document.getElementById("error-box-stack")!.innerText = error?.stack || error?.message || "";

    document.getElementById("error-box")!.style.display = "";
}

export function hideErrorPage() {
    document.getElementById("error-box")!.style.display = "none";
}
