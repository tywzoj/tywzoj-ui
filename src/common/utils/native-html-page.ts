export function showNativeErrorView(error?: Error) {
    document.getElementById("error-box-stack")!.innerText = error?.stack || error?.message || "";
    if (error) {
        console.error(error);
    }
    document.getElementById("error-box")!.style.display = "";
}

export function hideNativeErrorView() {
    document.getElementById("error-box")!.style.display = "none";
}

export function removeLoadingView() {
    document.getElementById("loading-view-overlay")?.remove();
}
