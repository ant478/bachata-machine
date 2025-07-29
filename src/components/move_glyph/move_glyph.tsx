import { memo, ReactNode } from 'react';
import cx from 'classnames';
import { COUNT, Count } from 'src/machine';
import { ReactComponent as ArrowLeft } from 'src/img/icons/arrow-left.svg';
import { ReactComponent as ArrowRight } from 'src/img/icons/arrow-right.svg';
import { ReactComponent as DoubleArrowLeft } from 'src/img/icons/double-arrow-left.svg';
import { ReactComponent as DoubleArrowRight } from 'src/img/icons/double-arrow-right.svg';
import { ReactComponent as ArrowLeftWithLine } from 'src/img/icons/arrow-left-with-line.svg';
import { ReactComponent as ArrowRightWithLine } from 'src/img/icons/arrow-right-with-line.svg';
import styles from './move_glyph.module.scss';

function getMoveGlyphSymbols(currentCount: Count, nextCount: Count): ReactNode[] {
    const number = currentCount === COUNT.RIGHT ? 1 : 5;
    const arrow =
        currentCount === COUNT.RIGHT ? (
            currentCount !== nextCount ? (
                <ArrowLeft />
            ) : (
                <DoubleArrowLeft />
            )
        ) : currentCount !== nextCount ? (
            <ArrowRight />
        ) : (
            <DoubleArrowRight />
        );

    return currentCount === COUNT.RIGHT ? [arrow, number] : [number, arrow];
}

function getPositionGlyphSymbols(currentCount: Count): ReactNode[] {
    return currentCount === COUNT.RIGHT ? [<ArrowRightWithLine />, '8'] : ['4', <ArrowLeftWithLine />];
}

export type MoveGlyphProps =
    | {
          className?: string;
          currentCount: Count;
          nextCount: Count;
      }
    | {
          className?: string;
          currentCount: Count;
      };

export const MoveGlyph = memo((props: MoveGlyphProps) => {
    const symbols =
        'nextCount' in props
            ? getMoveGlyphSymbols(props.currentCount, props.nextCount)
            : getPositionGlyphSymbols(props.currentCount);

    return (
        <span className={cx(styles.base, props.className)}>
            {symbols.map((symbol, index) => (
                <span key={index} className={styles.symbol}>
                    {symbol}
                </span>
            ))}
        </span>
    );
});
