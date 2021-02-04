// Adapted from RedWarn's TreemateEvents.ts
// https://gitlab.com/redwarn/redwarn-web/-/blob/dev-rwTS/src/event/RedWarnHooks.ts

import {Event, EventTypes} from "./EventDefinitions";

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Window {
        TreemateEvents: { [K in EventTypes]?: Event[] };
    }
}

export default class EventManager {
    static get eventListeners(): typeof window.TreemateEvents {
        return window.TreemateEvents ?? (window.TreemateEvents = {});
    }

    static assertHookType(hookType: EventTypes): void {
        if (EventManager.eventListeners[hookType] === undefined) {
            EventManager.eventListeners[hookType] = [];
        }
    }

    static addEventListener<T extends EventTypes>(
        eventType: T,
        event: Event
    ): void {
        this.assertHookType(eventType);
        (EventManager.eventListeners[eventType] as Event[]).push(event);
    }

    static removeEventListener<T extends EventTypes>(
        eventType: T,
        event: Event
    ): void {
        this.assertHookType(eventType);
        (EventManager.eventListeners[eventType] as Event[]).filter(
            (h) => h !== event
        );
    }

    static async callEvent<T extends EventTypes>(
        hookType: T,
        payload: Record<string, any> = {}
    ): Promise<void> {
        this.assertHookType(hookType);
        for (const hook of EventManager.eventListeners[hookType] as Event[]) {
            const result = hook(payload);
            if (result instanceof Promise) {
                await result;
            }
        }
    }

}
