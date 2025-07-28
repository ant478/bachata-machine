import cx from 'classnames';
import { memo, useRef, useCallback, useState, useReducer } from 'react';
import { useWindowEventListener } from 'src/hooks/useEventListener';
import { getHueValueFromLocalStorage, saveHueValueToLocalStorage, validateHueValue } from 'src/utils/hue';
import { HueControlSlider } from 'src/components/hue_control_slider/hue_control_slider';
import { ARROW_DOWN_KEY_CODE, ARROW_UP_KEY_CODE, ESC_KEY_CODE } from 'src/constants/key-codes';
import { HUE_DELTA } from 'src/constants/hue';
import { ReactComponent as BrushIcon } from 'src/img/brush.svg';

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

    const handleKeyDown = useCallback(
        ({ keyCode, ctrlKey }) => {
            if (!isControlVisibleRef.current) return;

            if (keyCode === ESC_KEY_CODE) {
                toggleIsControlVisible(false);
                return;
            }

            if (![ARROW_UP_KEY_CODE, ARROW_DOWN_KEY_CODE].includes(keyCode)) return;

            let delta = keyCode === ARROW_DOWN_KEY_CODE ? HUE_DELTA : -HUE_DELTA;

            if (ctrlKey) {
                delta *= 5;
            }

            const newValue = validateHueValue(valueRef.current + delta);

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
                onKeyDown={handleKeyDown}
                onWheel={handleWheel}
            >
                <BrushIcon className={styles.sampleIcon} />
            </button>
            {isControlVisible && (
                <HueControlSlider
                    className={styles.sliderMix}
                    value={value}
                    onChange={handleControlChange}
                    onKeyDown={handleKeyDown}
                    onWheel={handleWheel}
                />
            )}
        </div>
    );
});
