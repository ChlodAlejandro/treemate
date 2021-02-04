// Adapted from RedWarn's RedWarnHookEvent.ts
// https://gitlab.com/redwarn/redwarn-web/-/blob/dev-rwTS/src/event/RedWarnHookEvent.ts

export type TreemateEvent =
    | PreInitializationEvent
    | InitializationEvent
    | PostInitializationEvent;

interface EventBase {
    type: string;
    payload?: Record<string, any>;
}

export interface PreInitializationEvent extends EventBase {
    type: "preInit";
    payload: undefined;
}

export interface InitializationEvent extends EventBase {
    type: "init";
    payload: undefined;
}

export interface PostInitializationEvent extends EventBase {
    type: "postInit";
    payload: undefined;
}

export type EventTypes = TreemateEvent["type"];
export type Event = (
    payload: Record<string, any>
) => Promise<void> | void;
export type EventTyped<T extends TreemateEvent> = (
    payload: (Event & { payload: T["payload"] })["payload"]
) => Promise<void> | void;