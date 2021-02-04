/**
 * Handles the loading overlay, which is in the HTML file instead of in the app.
 */
export default class LoadingDOMHandler {

    /**
     * Hides the loading overlay from view, and removes it when the closing animation finishes.
     */
    static hideLoadingOverlay() : void {
        document.body.classList.remove("tm-loading");

        document.getElementById("tmLoadingOverlay")
            .addEventListener("animationend", (event) => {
                (event.target as HTMLElement).parentElement.removeChild((event.target as HTMLElement));
            });
    }

}