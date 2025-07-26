import { ComponentProps, memo, useCallback } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import styles from './custom_scrollbar.module.scss';
import cx from 'classnames';

export type CustomScrollbarProps = ComponentProps<typeof Scrollbars> & {
    className?: string;
    classNames?: {
        view?: string;
        thumbVertical?: string;
        trackVertical?: string;
    };
};

export const CustomScrollbar = memo(({ children, className, classNames = {}, ...otherProps }: CustomScrollbarProps) => {
    const renderView = useCallback(
        (props: any) => <div className={cx(styles.view, classNames.view)} {...props} />,
        [classNames.view]
    );
    const renderThumbVertical = useCallback(
        (props: any) => <div className={cx(styles.thumbVertical, classNames.thumbVertical)} {...props} />,
        [classNames.thumbVertical]
    );
    const renderTrackVertical = useCallback(
        (props: any) => <div className={cx(styles.trackVertical, classNames.trackVertical)} {...props} />,
        [classNames.trackVertical]
    );
    const renderTrackHorizontal = useCallback(
        (props: any) => <div className={styles.trackHorizontal} {...props} />,
        []
    );

    return (
        <Scrollbars
            className={className}
            renderView={renderView}
            renderThumbVertical={renderThumbVertical}
            renderTrackVertical={renderTrackVertical}
            renderTrackHorizontal={renderTrackHorizontal}
            {...otherProps}
        >
            {children}
        </Scrollbars>
    );
});
