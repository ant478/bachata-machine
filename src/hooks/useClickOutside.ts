import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(callback: () => void, whitelist: string[] = []) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                !ref.current ||
                ref.current.contains(event.target as Node) ||
                whitelist.some(selector => (event.target as Element).closest(selector))
            ) {
                return;
            }

            callback();
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [callback, whitelist]);

    return ref;
}
