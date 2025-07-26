import { memo, ReactNode, ComponentPropsWithoutRef } from 'react';
import cx from 'classnames';
import styles from './control_button.module.scss';

export type ControlButtonProps = ComponentPropsWithoutRef<'button'> & {
    icon?: ReactNode;
};

export const ControlButton = memo(({ icon, disabled, className, children, ...rest }: ControlButtonProps) => {
    const classes = cx(styles.base, disabled && styles.base__disabled, icon && styles.base__hasIcon, className);

    return (
        <button disabled={disabled} className={classes} type="button" {...rest}>
            {children}
            {icon && <span className="control-button_icon">{icon}</span>}
        </button>
    );
});
