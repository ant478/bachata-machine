import { memo, useState, useMemo, MouseEvent } from 'react';
import cx from 'classnames';
import { useEvent } from 'react-use-event-hook';
import { useBachataMachine } from 'src/components/bachata_machine/context';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { selectors } from 'src/store/slices/combination_slice';
import { addCombinations, saveCombinations } from 'src/store/slices/combination_slice';
import { DEFAULT_NAME } from 'src/constants/combination';
import { ControlButton } from 'src/components/control_button/control_button';
import { ReactComponent as MenuIcon } from 'src/img/menu.svg';
import { useClickOutside } from 'src/hooks/useClickOutside';
import { useEscKeydownListener } from 'src/hooks/useKeydownListener';
import { CustomScrollbar } from 'src/components/custom_scrollbar/custom_scrollbar';
import { EditableDiv } from 'src/components/editable_div/editable_div';
import type { Combination } from 'src/api/combinations';

import styles from './combination_menu.module.scss';

const COMBINATION_NAME_EDITABLE_DIV_ID = 'COMBINATION_NAME_EDITABLE_DIV_ID';

type MenuProps = {
    onClose?: () => void;
};

const openListScrollbarClasses = { view: styles.openListScrollbarView };

const Menu = memo(({ onClose }: MenuProps) => {
    const dispatch = useAppDispatch();
    const [isOpeListVisible, setOpenListVisible] = useState(false);
    const { openCombination, removeCurrentCombination } = useBachataMachine();
    useEscKeydownListener(onClose);
    const ref = useClickOutside<HTMLDivElement>(
        onClose,
        useMemo(() => [`.${styles.openMenuButton}`], [])
    );

    const combinations = useAppSelector(selectors.selectAll);

    const handleNewClick = useEvent(() => {
        const ids = new Set<number>(combinations.map(({ id }) => id));
        let newId = 0;
        while (ids.has(newId)) newId++;
        openCombination(newId);
        onClose();
    });
    const handleOpenClick = useEvent(() => {
        setOpenListVisible(value => !value);
    });
    const handleRemoveClick = useEvent(() => {
        removeCurrentCombination();
        onClose();
    });
    const handleRenameClick = useEvent(() => {
        document.getElementById(COMBINATION_NAME_EDITABLE_DIV_ID)?.click();
        onClose();
    });
    const handleCombinationOpenClick = useEvent((event: MouseEvent<HTMLButtonElement>) => {
        openCombination(Number(event.currentTarget.dataset.combinationId));
        onClose();
    });
    const handleImportClick = useEvent(() => {
        onClose();
        new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';

            input.onchange = () => {
                const file = input.files?.[0];
                if (!file) return reject(new Error('No file selected'));

                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const result = JSON.parse(reader.result as string);
                        resolve(result);
                    } catch (err) {
                        reject(new Error('Invalid JSON'));
                    }
                };
                reader.onerror = () => reject(new Error('Reading error'));
                reader.readAsText(file);
            };

            input.click();
        })
            .then((importedCombinations: Combination[]) => {
                const newCombinations = importedCombinations.filter(
                    ({ id, ...importedCombinationWithoutId }) =>
                        !combinations.some(
                            ({ id, ...combinationWithoutId }) =>
                                JSON.stringify(importedCombinationWithoutId) === JSON.stringify(combinationWithoutId)
                        )
                );

                if (newCombinations.length === 0) return;

                const ids = new Set<number>(combinations.map(({ id }) => id));
                for (const newCombination of newCombinations) {
                    while (ids.has(newCombination.id)) newCombination.id++;
                    ids.add(newCombination.id);
                }
                dispatch(addCombinations(newCombinations));
                dispatch(saveCombinations());
                openCombination(newCombinations[0].id);
            })
            .catch(err => {
                console.error('Error:', err.message);
            });
    });
    const handleExportClick = useEvent(() => {
        const json = JSON.stringify(combinations, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ant478-bachata-machine-combinations.json';
        a.click();

        URL.revokeObjectURL(url);

        onClose();
    });

    return (
        <div ref={ref} className={styles.menu}>
            <CustomScrollbar classNames={openListScrollbarClasses}>
                {(() => {
                    if (isOpeListVisible) {
                        return combinations.map(({ id, name }) => (
                            <ControlButton
                                key={id}
                                title={`Open "${name}"`}
                                className={styles.menuButton}
                                data-combination-id={id}
                                onClick={handleCombinationOpenClick}
                            >
                                {name}
                            </ControlButton>
                        ));
                    }

                    return (
                        <>
                            <ControlButton title="New" className={styles.menuButton} onClick={handleNewClick}>
                                ✚ New
                            </ControlButton>
                            <ControlButton title="Open" className={styles.menuButton} onClick={handleOpenClick}>
                                ▣ Open
                            </ControlButton>
                            <ControlButton title="Rename" className={styles.menuButton} onClick={handleRenameClick}>
                                🖉 Rename
                            </ControlButton>
                            <ControlButton title="Delete" className={styles.menuButton} onClick={handleRemoveClick}>
                                🗙 Delete
                            </ControlButton>
                            <ControlButton title="Import" className={styles.menuButton} onClick={handleImportClick}>
                                🡇 Import
                            </ControlButton>
                            <ControlButton title="Export" className={styles.menuButton} onClick={handleExportClick}>
                                🡅 Export
                            </ControlButton>
                        </>
                    );
                })()}
            </CustomScrollbar>
        </div>
    );
});

export type CombinationMenuProps = {
    className?: string;
};

export const CombinationMenu = memo(({ className }: CombinationMenuProps) => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const { currentCombinationId, renameCurrentCombination } = useBachataMachine();
    const combination = useAppSelector(state => selectors.selectById(state, currentCombinationId));
    const handleButtonMenuClick = useEvent(() => setMenuVisible(value => !value));
    const handleClose = useEvent(() => setMenuVisible(false));
    const handleNameChange = useEvent((value: string) => {
        const newName = value || DEFAULT_NAME;
        const isNameChanged = combination ? newName !== combination.name : newName !== DEFAULT_NAME;
        if (isNameChanged) renameCurrentCombination(newName);
        return isNameChanged;
    });

    return (
        <div className={cx(styles.base, className)}>
            <h2 className={styles.title}>Combination:</h2>
            <EditableDiv
                id={COMBINATION_NAME_EDITABLE_DIV_ID}
                className={styles.combinationName}
                onApply={handleNameChange}
            >
                {combination?.name || DEFAULT_NAME}
            </EditableDiv>
            {isMenuVisible && <Menu onClose={handleClose} />}
            <ControlButton title="Menu" className={styles.openMenuButton} onClick={handleButtonMenuClick}>
                <MenuIcon className={styles.menuIcon} />
            </ControlButton>
        </div>
    );
});
