import { memo } from 'react';
import { Logo } from 'src/components/logo/logo';
import { HueControl } from 'src/components/hue_control/hue_control';
import styles from './header.module.scss';

export const Header = memo(() => {
    return (
        <header className={styles.base} style={styles}>
            <a className={styles.logoLink} href="/" title="ant478 Bachata Machine">
                <Logo wc-gear-spin-duration="60s" className={styles.logo} />
            </a>
            <h1 className={styles.title}>Bachata Machine</h1>
            <HueControl className={styles.hueControlMix} />
        </header>
    );
});
