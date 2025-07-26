import { useEffect, useCallback } from 'react';
import { ESC_KEY_CODE } from 'src/constants/key-codes';

export function useKeydownListener(keyCode: number, callback: () => void): void {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.keyCode === keyCode) {
                callback();
            }
        },
        [callback, keyCode]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

export const useEscKeydownListener = (callback: () => void): void => useKeydownListener(ESC_KEY_CODE, callback);
