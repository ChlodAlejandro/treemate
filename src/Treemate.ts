/*
 * Copyright 2021 Chlod Alejandro
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/**
 * Treemate
 *
 * A basic flowchart builder. Open-source and free of charge.
 *
 * @copyright Apache License 2.0 - Chlod Alejandro
 **/

import EventManager from "./event/EventManager";
import DOMEvents from "./ui/dom/DOMEvents";
import AppWindow from "./ui/AppWindow";

(async () => {
    await EventManager.callEvent("preInit");

    // Register all DOM-modifying events.
    DOMEvents.register();

    await EventManager.callEvent("init");

    // Attach app window to DOM.
    AppWindow.attach();

    await EventManager.callEvent("postInit");
})();