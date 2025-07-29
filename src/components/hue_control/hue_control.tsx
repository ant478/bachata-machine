import cx from 'classnames';
import { memo, useRef, useCallback, useState, useReducer } from 'react';
import { useWindowEventListener } from 'src/hooks/useEventListener';
import { getHueValueFromLocalStorage, saveHueValueToLocalStorage, validateHueValue } from 'src/utils/hue';
import { HueControlSlider } from 'src/components/hue_control_slider/hue_control_slider';
import { HUE_DELTA } from 'src/constants/hue';
import { ReactComponent as BrushIcon } from 'src/img/icons/brush.svg';
import { useEscKeydownListener } from 'src/hooks/useKeydownListener';
import { useEvent } from 'react-use-event-hook';

import styles from './hue_control.module.scss';

export type HueControlProps = {
    className?: string;
};

export const HueControl = memo(({ className }: HueControlProps) => {
    const baseRef = useRef(null);
    const [isControlVisible, toggleIsControlVisible] = useReducer(
        (isVisible, newValue = undefined) => newValue ?? !isVisible,
        false
    );
    const isControlVisibleRef = useRef(isControlVisible);
    const [value, setValue] = useState(getHueValueFromLocalStorage());
    const valueRef = useRef(value);

    valueRef.current = value;
    isControlVisibleRef.current = isControlVisible;

    const changeValue = useCallback(newValue => {
        setValue(newValue);
        document.documentElement.style.setProperty('--hue', newValue);
        saveHueValueToLocalStorage(newValue);
    }, []);

    const handleControlChange = useCallback(
        newValue => {
            changeValue(newValue);
        },
        [changeValue]
    );

    const handleWheel = useCallback(
        ({ deltaY }) => {
            if (!isControlVisibleRef.current) return;

            const delta = deltaY > 0 ? HUE_DELTA : -HUE_DELTA;
            const newValue = validateHueValue(valueRef.current + delta);

            changeValue(newValue);
        },
        [changeValue]
    );

    const handleControlClick = useCallback(() => {
        toggleIsControlVisible();
    }, []);

    const handleWindowClick = useCallback(({ target }) => {
        if (!baseRef.current) return;

        const isInside = target === baseRef.current || baseRef.current.contains(target);

        if (!isInside) toggleIsControlVisible(false);
    }, []);

    const handleEsc = useEvent(() => toggleIsControlVisible(false));
    useEscKeydownListener(handleEsc);
    useWindowEventListener('click', handleWindowClick);
    useWindowEventListener('touchstart', handleWindowClick);

    const classes = cx(styles.base, className, {
        [styles.base__controlVisible]: isControlVisible,
    });

    return (
        <div ref={baseRef} className={classes}>
            <button
                title="Change style"
                onClick={handleControlClick}
                type="button"
                className={styles.sample}
                onWheel={handleWheel}
            >
                <BrushIcon className={styles.sampleIcon} />
            </button>
            {isControlVisible && (
                <HueControlSlider
                    className={styles.sliderMix}
                    value={value}
                    onChange={handleControlChange}
                    onWheel={handleWheel}
                />
            )}
        </div>
    );
});
