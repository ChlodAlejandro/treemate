export default class LoadingDOMHandler {

    static hideLoadingOverlay() {
        document.body.classList.remove("tm-loading");

        document.getElementById("tmLoadingOverlay")
            .addEventListener("animationend", (event) => {
                (event.target as HTMLElement).parentElement.removeChild((event.target as HTMLElement));
            });
    }

}