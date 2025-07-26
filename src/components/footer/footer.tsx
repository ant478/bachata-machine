import { memo } from 'react';
import { Footer as WebFooter } from '@ant478/web-components';
import styles from './footer.module.scss';
import cx from 'classnames';

if (!customElements.get('ant478-footer')) {
    customElements.define('ant478-footer', WebFooter);
}

export type FooterProps = {
    className?: string;
};

export const Footer = memo(({ className }: FooterProps) => {
    return (
        /* @ts-ignore */
        <ant478-footer class={cx(styles.base, className)}></ant478-footer>
    );
});
