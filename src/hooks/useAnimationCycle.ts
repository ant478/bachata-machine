import { useLayoutEffect, useRef, useCallback } from 'react';

export default function useAnimationCycle(callback: () => void, isInitiallyActive = false) {
    const isActive = useRef(false);
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const cycle = useCallback(() => {
        if (!isActive.current) return;

        callbackRef.current();
        requestAnimationFrame(cycle);
    }, []);

    const runAnimationCycle = useCallback(() => {
        if (isActive.current) return;

        isActive.current = true;
        requestAnimationFrame(cycle);
    }, [cycle]);

    const stopAnimationCycle = useCallback(() => {
        isActive.current = false;
    }, []);

    useLayoutEffect(() => {
        if (isInitiallyActive) runAnimationCycle();

        return () => stopAnimationCycle();
    }, [runAnimationCycle, stopAnimationCycle, isInitiallyActive]);

    return [runAnimationCycle, stopAnimationCycle];
}
