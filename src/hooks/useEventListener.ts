import { useEffect } from 'react';

type ListenerOptions = boolean | AddEventListenerOptions;

export function useEventListener<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    event: K,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: ListenerOptions
): void;
export function useEventListener<K extends keyof WindowEventMap>(
    target: Window,
    event: K,
    callback: (this: Window, ev: WindowEventMap[K]) => any,
    options?: ListenerOptions
): void;
export function useEventListener(
    target: HTMLElement | Window,
    event: string,
    callback: EventListenerOrEventListenerObject,
    options?: ListenerOptions
): void {
    useEffect(() => {
        target.addEventListener(event, callback, options);
        return () => target.removeEventListener(event, callback, options);
    }, [target, event, callback, options]);
}
export const useWindowEventListener = <K extends keyof WindowEventMap>(
    event: K,
    callback: (this: Window, ev: WindowEventMap[K]) => any,
    options?: ListenerOptions
) => useEventListener(window, event, callback, options);
