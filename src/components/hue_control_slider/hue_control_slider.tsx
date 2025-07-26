import {
    useRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    KeyboardEventHandler,
    MouseEvent as ReactMouseEvent,
    WheelEventHandler,
} from 'react';
import cx from 'classnames';
import { HUE_RANGE } from 'src/constants/hue';
import { useWindowEventListener } from 'src/hooks/useEventListener';
import useAnimationCycle from 'src/hooks/useAnimationCycle';
import { validateHueValue } from 'src/utils/hue';

import styles from './hue_control_slider.module.scss';

const getTransformTranslate = (x: number, y: number) => `translate(${x}px, ${y}px)`;
const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export type HueControlSliderProps = {
    className?: string;
    value: number;
    onChange: (value: number) => void;
    onWheel: WheelEventHandler<HTMLDivElement>;
    onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
};

export const HueControlSlider = ({ className, value = 0, onChange, onWheel, onKeyDown }: HueControlSliderProps) => {
    const controlRef = useRef(null);
    const sliderRef = useRef(null);
    const valueRef = useRef(value);
    const mousePositionRef = useRef(0);
    const sliderPositionRef = useRef(0);
    const clickOffsetRef = useRef(0);
    const isMouseDownRef = useRef(false);

    valueRef.current = value;

    const updateSliderPosition = useCallback(
        (y: number) => {
            if (y === sliderPositionRef.current) return;

            sliderPositionRef.current = clamp(y, 0, controlRef.current.offsetHeight);

            if (!isMouseDownRef.current) return;

            const newValue = validateHueValue(
                (HUE_RANGE * sliderPositionRef.current) / controlRef.current.offsetHeight
            );

            if (valueRef.current !== newValue) onChange(newValue);
        },
        [onChange]
    );

    const animateSliderPosition = useCallback(() => {
        sliderRef.current.style.transform = getTransformTranslate(
            -(sliderRef.current.offsetWidth >> 1),
            sliderPositionRef.current
        );
    }, []);

    const animateSliderDragging = useCallback(() => {
        updateSliderPosition(mousePositionRef.current - clickOffsetRef.current);
    }, [updateSliderPosition]);

    useLayoutEffect(() => {
        updateSliderPosition(~~((controlRef.current.offsetHeight * value) / HUE_RANGE));
        animateSliderPosition();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!isMouseDownRef.current) updateSliderPosition(~~((controlRef.current.offsetHeight * value) / HUE_RANGE));
    }, [value, updateSliderPosition]);

    const [startDraggingAnimation, stopDraggingAnimation] = useAnimationCycle(animateSliderDragging);
    useAnimationCycle(animateSliderPosition, true);

    const handleControlMouseDown = useCallback(
        (event: ReactMouseEvent) => {
            clickOffsetRef.current =
                event.target === sliderRef.current
                    ? event.clientY - sliderPositionRef.current
                    : controlRef.current.getBoundingClientRect().top;

            startDraggingAnimation();
            event.stopPropagation();
            isMouseDownRef.current = true;
        },
        [startDraggingAnimation]
    );

    const handleWindowMouseMove = useCallback(({ clientY }: MouseEvent) => {
        mousePositionRef.current = clientY;
    }, []);

    const handleWindowMouseUp = useCallback(() => {
        isMouseDownRef.current = false;
        stopDraggingAnimation();
    }, [stopDraggingAnimation]);

    const handleWheel = useCallback(
        event => {
            if (isMouseDownRef.current) return;

            onWheel(event);
        },
        [onWheel]
    );

    const handleKeyDown = useCallback(
        event => {
            if (isMouseDownRef.current) return;

            onKeyDown(event);
        },
        [onKeyDown]
    );

    useWindowEventListener('mousemove', handleWindowMouseMove);
    useWindowEventListener('mouseup', handleWindowMouseUp);

    return (
        <div className={cx(styles.base, className)} onWheel={handleWheel}>
            <div className={styles.control} ref={controlRef} onMouseDown={handleControlMouseDown}>
                <button onKeyDown={handleKeyDown} type="button" className={styles.slider} ref={sliderRef} />
            </div>
        </div>
    );
};
