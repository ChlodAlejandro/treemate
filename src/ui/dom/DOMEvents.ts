import EventManager from "../../event/EventManager";
import LoadingDOMHandler from "./LoadingDOMHandler";

/**
 * Class for handling events that deal with DOM modification.
 */
export default class DOMEvents {

    /**
     * Registers DOM-modifying events that wait for Treemate events.
     */
    static register() : void {
        EventManager.addEventListener("postInit", LoadingDOMHandler.hideLoadingOverlay);
    }

}