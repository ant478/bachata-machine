import { memo, MouseEvent } from 'react';
import cx from 'classnames';
import { useEvent } from 'react-use-event-hook';
import { useBachataMachine } from 'src/components/bachata_machine/context';
import { CustomScrollbar } from 'src/components/custom_scrollbar/custom_scrollbar';
import { ControlButton } from 'src/components/control_button/control_button';
import { MoveGlyph } from 'src/components/move_glyph/move_glyph';
import { MoveId } from 'src/machine';
import { MOVE_TITLE_BY_ID, POSITION_TITLE_BY_ID } from 'src/strings';

import styles from './available_moves.module.scss';

export type AvailableMovesProps = {
    className?: string;
};

const scrollbarClasses = { view: styles.scrollbarView };

export const AvailableMoves = memo(({ className }: AvailableMovesProps) => {
    const { availableMoves, makeMove, currentCount, currentPositionId } = useBachataMachine();
    const handleMoveClick = useEvent((event: MouseEvent<HTMLButtonElement>) => {
        makeMove(event.currentTarget.dataset.moveId as MoveId);
    });

    return (
        <div className={cx(styles.base, className)}>
            <h2 className={styles.title}>Available Moves:</h2>
            <CustomScrollbar classNames={scrollbarClasses}>
                {availableMoves.map(({ moveId, nextPositionId, nextCount }) => (
                    <ControlButton
                        title={`${MOVE_TITLE_BY_ID[moveId]} to ${POSITION_TITLE_BY_ID[nextPositionId]}`}
                        key={moveId}
                        className={styles.buttonMix}
                        data-move-id={moveId}
                        onClick={handleMoveClick}
                    >
                        {MOVE_TITLE_BY_ID[moveId]}
                        {currentPositionId !== nextPositionId && (
                            <div className={styles.nextPosition}>
                                To:{' '}
                                <span className={styles.nextPositionHighlight}>
                                    {POSITION_TITLE_BY_ID[nextPositionId]}
                                </span>
                            </div>
                        )}
                        <MoveGlyph className={styles.moveGlyphMix} currentCount={currentCount} nextCount={nextCount} />
                    </ControlButton>
                ))}
            </CustomScrollbar>
        </div>
    );
});
