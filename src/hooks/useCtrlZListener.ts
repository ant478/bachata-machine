import { useEffect, useCallback } from 'react';

export function useCtrlZListener(callback: () => void): void {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const isCtrlOrMeta = event.ctrlKey || event.metaKey;
            const isZ = event.key === 'z' || event.key === 'Z' || event.key === 'я' || event.key === 'Я';

            if (isCtrlOrMeta && isZ) {
                callback();
                event.preventDefault();
            }
        },
        [callback]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
