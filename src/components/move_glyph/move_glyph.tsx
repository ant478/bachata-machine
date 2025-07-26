import { memo } from 'react';
import cx from 'classnames';
import styles from './move_glyph.module.scss';

export type MoveGlyphProps = {
    className?: string;
    symbols: string;
};

export const MoveGlyph = memo(({ className, symbols }: MoveGlyphProps) => (
    <span className={cx(styles.base, className)}>
        {symbols.split('').map((symbol, index) => (
            <span key={index} className={styles.symbol}>
                {symbol}
            </span>
        ))}
    </span>
));
