import { memo } from 'react';
import cx from 'classnames';
import { useBachataMachine } from 'src/components/bachata_machine/context';
import { CustomScrollbar } from 'src/components/custom_scrollbar/custom_scrollbar';
import { MoveGlyph } from 'src/components/move_glyph/move_glyph';
import { getMoveGlyphSymbols } from 'src/utils/strings';
import { COUNT } from 'src/machine';
import { POSITION_TITLE_BY_ID, MOVE_TITLE_BY_ID } from 'src/strings';
import { ControlButton } from 'src/components/control_button/control_button';
import { ReactComponent as UndoIcon } from 'src/img/undo.svg';
import { useCtrlZListener } from 'src/hooks/useCtrlZListener';
import { useEvent } from 'react-use-event-hook';
import { isElementEditable } from 'src/utils/dom';

import styles from './combination_moves.module.scss';

export type CombinationMovesProps = {
    className?: string;
};

const scrollbarClasses = { view: styles.scrollbarView };

export const CombinationMoves = memo(({ className }: CombinationMovesProps) => {
    const { movesHistory, undoLastMove } = useBachataMachine();
    const handleCtrlZ = useEvent(() => {
        if (!isElementEditable(document.activeElement)) {
            undoLastMove();
            return true;
        }

        return false;
    });
    useCtrlZListener(handleCtrlZ);

    return (
        <div className={cx(styles.base, className)}>
            <h2 className={styles.title}>Moves:</h2>
            <ControlButton
                title="Undo"
                className={styles.undoButton}
                onClick={undoLastMove}
                disabled={movesHistory.length <= 1}
            >
                <UndoIcon className={styles.undoIcon} />
            </ControlButton>
            <CustomScrollbar classNames={scrollbarClasses}>
                {movesHistory.flatMap(({ moveId, nextPositionId: positionId, nextCount: count }, index) => {
                    if (index === 0) {
                        return (
                            <div
                                key={index}
                                className={cx(styles.move, styles[`move__count${count}`], styles.move__positionStart)}
                            >
                                <div className={styles.moveBackground} />
                                <div className={styles.moveNewPosition}>
                                    Start:{' '}
                                    <span className={styles.moveNewPositionHighlight}>
                                        {POSITION_TITLE_BY_ID[positionId]}
                                    </span>
                                </div>
                            </div>
                        );
                    }

                    const { nextPositionId: prevPositionId, nextCount: prevCount } = movesHistory[index - 1];
                    const isPositionChanged = prevPositionId !== positionId;
                    const isLast = index === movesHistory.length - 1;

                    if (count === prevCount) {
                        const middleCount = count === COUNT.LEFT ? COUNT.RIGHT : COUNT.LEFT;

                        return [
                            <div
                                key={`${index}:0`}
                                className={cx(
                                    styles.move,
                                    styles[`move__count${middleCount}`],
                                    styles.move__positionContinue
                                )}
                            >
                                <div className={styles.moveBackground} />
                                {MOVE_TITLE_BY_ID[moveId]}
                                <MoveGlyph
                                    className={styles.moveGlyph}
                                    symbols={getMoveGlyphSymbols(count, middleCount)}
                                />
                            </div>,
                            <div
                                key={`${index}:1`}
                                className={cx(
                                    styles.move,
                                    styles[`move__count${count}`],
                                    isPositionChanged && !isLast && styles.move__positionStart,
                                    isPositionChanged ? styles.move__positionEnd : styles.move__positionContinue
                                )}
                            >
                                <div className={styles.moveBackground} />
                                ...
                                <MoveGlyph
                                    className={styles.moveGlyph}
                                    symbols={getMoveGlyphSymbols(middleCount, count)}
                                />
                                {isPositionChanged && (
                                    <div className={styles.moveNewPosition}>
                                        To:{' '}
                                        <span className={styles.moveNewPositionHighlight}>
                                            {POSITION_TITLE_BY_ID[positionId]}
                                        </span>
                                    </div>
                                )}
                            </div>,
                        ];
                    }

                    return (
                        <div
                            key={index}
                            className={cx(
                                styles.move,
                                styles[`move__count${count}`],
                                isPositionChanged && !isLast && styles.move__positionStart,
                                isPositionChanged ? styles.move__positionEnd : styles.move__positionContinue
                            )}
                        >
                            <div className={styles.moveBackground} />
                            {MOVE_TITLE_BY_ID[moveId]}
                            <MoveGlyph className={styles.moveGlyph} symbols={getMoveGlyphSymbols(prevCount, count)} />
                            {isPositionChanged && (
                                <div className={styles.moveNewPosition}>
                                    To:{' '}
                                    <span className={styles.moveNewPositionHighlight}>
                                        {POSITION_TITLE_BY_ID[positionId]}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </CustomScrollbar>
        </div>
    );
});
