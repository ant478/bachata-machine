import cx from 'classnames';
import { memo, useState, useCallback, useLayoutEffect, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { useEscKeydownListener } from 'src/hooks/useKeydownListener';
import { ControlButton } from 'src/components/control_button/control_button';
import styles from './fullscreen_overlay.module.scss';

export type FullscreenOverlayProps = PropsWithChildren<{
    className?: string;
    controls?: {
        show(): void;
        hide(): void;
    };
}>;

export const FullscreenOverlay = memo(({ className, controls, children }: FullscreenOverlayProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const hide = useCallback(() => setIsVisible(false), []);

    useLayoutEffect(() => {
        if (controls) {
            controls.show = () => setIsVisible(true);
            controls.hide = hide;
        }
    }, [hide, controls]);

    useEscKeydownListener(hide);

    if (!isVisible) {
        return null;
    }

    return createPortal(
        <div className={cx(styles.base, className)}>
            {children}
            <ControlButton title="Close" className={styles.closeMix} onClick={hide}>
                🗙
            </ControlButton>
        </div>,
        document.getElementById('root')
    );
});
