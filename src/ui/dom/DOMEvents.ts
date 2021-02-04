import EventManager from "../../event/EventManager";
import LoadingDOMHandler from "./LoadingDOMHandler";

export default class DOMEvents {

    static register() {
        EventManager.addEventListener("postInit", LoadingDOMHandler.hideLoadingOverlay);
    }

}