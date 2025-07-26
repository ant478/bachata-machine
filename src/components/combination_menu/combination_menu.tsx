import { memo, useState } from 'react';
import cx from 'classnames';
import { useEvent } from 'react-use-event-hook';
import { useBachataMachine } from 'src/components/bachata_machine/context';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { selectors } from 'src/store/slices/combination_slice';
import { DEFAULT_NAME } from 'src/constants/combination';
import { ControlButton } from 'src/components/control_button/control_button';
import { ReactComponent as MenuIcon } from 'src/img/menu.svg';
import { useClickOutside } from 'src/hooks/useClickOutside';
import { useEscKeydownListener } from 'src/hooks/useKeydownListener';

import styles from './combination_menu.module.scss';

type MenuProps = {
    onClose?: () => void;
};

const Menu = memo(({ onClose }: MenuProps) => {
    useEscKeydownListener(onClose);
    const ref = useClickOutside<HTMLDivElement>(onClose);

    return (
        <div ref={ref} className={styles.menu}>
            <ControlButton title="New" className={styles.menuButton}>
                New
            </ControlButton>

            <ControlButton title="Open" className={styles.menuButton}>
                Open
            </ControlButton>

            <ControlButton title="Rename" className={styles.menuButton}>
                Rename
            </ControlButton>

            <ControlButton title="Delete" className={styles.menuButton}>
                Delete
            </ControlButton>

            <ControlButton title="Import" className={styles.menuButton}>
                Import
            </ControlButton>

            <ControlButton title="Export" className={styles.menuButton}>
                Export
            </ControlButton>
        </div>
    );
});

export type CombinationMenuProps = {
    className?: string;
};

export const CombinationMenu = memo(({ className }: CombinationMenuProps) => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const { currentCombinationId } = useBachataMachine();
    const combination = useAppSelector(state => selectors.selectById(state, currentCombinationId));
    const handleButtonMenuClick = useEvent(() => setMenuVisible(value => !value));
    const handleClose = useEvent(() => setMenuVisible(false));

    return (
        <div className={cx(styles.base, className)}>
            <h2 className={styles.title}>Combination:</h2>
            <div className={styles.combinationName}>{combination?.name || DEFAULT_NAME}</div>
            {isMenuVisible && <Menu onClose={handleClose} />}
            <ControlButton title="Menu" className={styles.openMenuButton} onClick={handleButtonMenuClick}>
                <MenuIcon className={styles.menuIcon} />
            </ControlButton>
        </div>
    );
});
