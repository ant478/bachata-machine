import { memo } from 'react';
import cx from 'classnames';
import { useBachataMachine } from 'src/components/bachata_machine/context';
import { MoveGlyph } from 'src/components/move_glyph/move_glyph';
import { POSITION_TITLE_BY_ID } from 'src/strings';
import styles from './current_position.module.scss';

export type CurrentPositionProps = {
    className?: string;
};

export const CurrentPosition = memo(({ className }: CurrentPositionProps) => {
    const { currentPositionId, currentCount } = useBachataMachine();

    return (
        <div className={cx(styles.base, className)}>
            <h2 className={styles.title}>Current Position:</h2>
            <div className={styles.position}>{POSITION_TITLE_BY_ID[currentPositionId]}</div>
            <MoveGlyph className={styles.moveGlyphMix} currentCount={currentCount} />
        </div>
    );
});
