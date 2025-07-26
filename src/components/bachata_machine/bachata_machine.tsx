import { memo } from 'react';
import cx from 'classnames';
import { CombinationMoves } from 'src/components/combination_moves/combination_moves';
import { CombinationMenu } from 'src/components/combination_menu/combination_menu';
import { CurrentPosition } from 'src/components/current_position/current_position';
import { AvailableMoves } from 'src/components/available_moves/available_moves';
import { BachataMachineContextProvider } from './provider';
import styles from './bachata_machine.module.scss';

export type BachataMachineProps = {
    className?: string;
};

const BachataMachineComponent = memo(({ className }: BachataMachineProps) => {
    return (
        <div className={cx(styles.base, className)}>
            <div className={styles.left}>
                <CombinationMenu className={styles.combinationMenuMix} />
                <CombinationMoves className={styles.combinationMovesMix} />
            </div>
            <div className={styles.right}>
                <CurrentPosition className={styles.currentPositionMix} />
                <AvailableMoves className={styles.availableMovesMix} />
            </div>
        </div>
    );
});

export const BachataMachine = memo((props: BachataMachineProps) => {
    return (
        <BachataMachineContextProvider>
            <BachataMachineComponent {...props} />
        </BachataMachineContextProvider>
    );
});
