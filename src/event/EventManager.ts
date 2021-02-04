// Adapted from RedWarn's TreemateEvents.ts
// https://gitlab.com/redwarn/redwarn-web/-/blob/dev-rwTS/src/event/RedWarnHooks.ts

import {Event, EventTypes} from "./EventDefinitions";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        TreemateEvents: { [K in EventTypes]?: Event[] };
    }
}

/**
 * The EventManager handles events which can then be received by other scripts
 * or by internal event listeners.
 */
export default class EventManager {
    /** @returns All registered event listeners. */
    static get eventListeners(): typeof window.TreemateEvents {
        return window.TreemateEvents ?? (window.TreemateEvents = {});
    }

    /**
     * Make sure that an event type in the event list is initialized with
     * an empty array.
     *
     * @param eventType The event type to initialize/leave alone.
     */
    static assertEventType(eventType: EventTypes): void {
        if (EventManager.eventListeners[eventType] === undefined) {
            EventManager.eventListeners[eventType] = [];
        }
    }

    /**
     * Adds an event listener.
     *
     * @param eventType The type of event to listen for.
     * @param eventListener The event listener to add.
     */
    static addEventListener<T extends EventTypes>(
        eventType: T,
        eventListener: Event
    ): void {
        this.assertEventType(eventType);
        (EventManager.eventListeners[eventType] as Event[]).push(eventListener);
    }

    /**
     * Removes an event listener.
     *
     * @param eventType The type of event to listen for.
     * @param eventListener The event listener to remove.
     */
    static removeEventListener<T extends EventTypes>(
        eventType: T,
        eventListener: Event
    ): void {
        this.assertEventType(eventType);
        (EventManager.eventListeners[eventType] as Event[]).filter(
            (h) => h !== eventListener
        );
    }

    /**
     * Calls all event listeners listening for a given type.
     *
     * @param eventType The type of event to listen for.
     * @param payload Additional data to be given to the event handler.
     */
    static async callEvent<T extends EventTypes>(
        eventType: T,
        payload: Record<string, any> = {}
    ): Promise<void> {
        this.assertEventType(eventType);
        for (const hook of EventManager.eventListeners[eventType] as Event[]) {
            const result = hook(payload);
            if (result instanceof Promise) {
                await result;
            }
        }
    }

}
