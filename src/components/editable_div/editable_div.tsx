import { memo, ComponentPropsWithoutRef, MouseEvent, KeyboardEvent, FocusEvent, useLayoutEffect } from 'react';
import { useEvent } from 'react-use-event-hook';
import { useClickOutside } from 'src/hooks/useClickOutside';
import { useEscKeydownListener } from 'src/hooks/useKeydownListener';
import { filterUserInput } from 'src/utils/strings';
import styles from './editable_div.module.scss';
import cx from 'classnames';

export type EditableDivProps = ComponentPropsWithoutRef<'div'> & {
    onApply?: (value: string) => boolean;
    children?: string;
};

export const EditableDiv = memo(({ children, onApply, ...props }: EditableDivProps) => {
    const handleSave = useEvent(() => {
        if (!ref.current.hasAttribute('contenteditable')) return;

        ref.current.removeAttribute('contenteditable');
        const result = onApply(filterUserInput(ref.current.innerText));
        if (!result) ref.current.innerText = children;
    });
    const handleCancel = useEvent(() => {
        if (!ref.current.hasAttribute('contenteditable')) return;

        ref.current.removeAttribute('contenteditable');
        ref.current.innerText = children;
    });

    const ref = useClickOutside<HTMLDivElement>(handleSave);
    useEscKeydownListener(handleCancel);

    useLayoutEffect(() => {
        ref.current.innerText = children;
    }, [ref, children]);

    const handleClick = useEvent((event: MouseEvent<HTMLDivElement>) => {
        ref.current.setAttribute('contenteditable', 'true');
        ref.current.focus();
        props.onClick?.(event);
    });

    const handleKeyDown = useEvent((event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSave();
        }
        props.onKeyDown?.(event);
    });

    const handleBlur = useEvent((event: FocusEvent<HTMLDivElement>) => {
        handleSave();
        props.onBlur?.(event);
    });

    return (
        <div
            {...props}
            className={cx(styles.base, props.className)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={ref}
        />
    );
});
