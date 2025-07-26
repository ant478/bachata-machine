import { useEffect } from 'react';

export function useEventListener<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    event: K,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
): void;
export function useEventListener<K extends keyof WindowEventMap>(
    target: Window,
    event: K,
    callback: (this: Window, ev: WindowEventMap[K]) => any
): void;
export function useEventListener(
    target: HTMLElement | Window,
    event: string,
    callback: EventListenerOrEventListenerObject
): void {
    useEffect(() => {
        target.addEventListener(event, callback);
        return () => target.removeEventListener(event, callback);
    }, [target, event, callback]);
}

export const useWindowEventListener = <K extends keyof WindowEventMap>(
    event: K,
    callback: (this: Window, ev: WindowEventMap[K]) => any
) => useEventListener(window, event, callback);
