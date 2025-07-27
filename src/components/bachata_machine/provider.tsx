import { PropsWithChildren, useState, useMemo, useRef, useLayoutEffect } from 'react';
import { createActor, Actor } from 'xstate';
import { useEvent } from 'react-use-event-hook';
import { LS_KEY_BASE } from 'src/constants/local_storage';
import { Combination } from 'src/api/combinations';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import {
    selectors,
    saveCombinations,
    addCombination,
    updateCombination,
    removeCombination,
} from 'src/store/slices/combination_slice';
import { machine, COMMAND_ID, unpackState, TRANSITIONS_CONFIG, MoveId, INITIAL_STATE } from 'src/machine';
import { bachataMachineContext, BachataMachineContextData } from './context';
import { DEFAULT_NAME } from 'src/constants/combination';

const [initialPosition, initialCount] = unpackState(INITIAL_STATE);

export type BachataMachineContextProviderProps = PropsWithChildren;

function getInitialCombinationId(combinations: Combination[]) {
    if (combinations.length === 0) return 0;
    const value = Number(localStorage.getItem(`${LS_KEY_BASE}:last_combination_id`));
    if (Number.isNaN(value)) return combinations[0].id;
    if (combinations.every(({ id }) => id !== value)) return combinations[0].id;
    return value;
}

export function BachataMachineContextProvider({ children }: BachataMachineContextProviderProps) {
    const dispatch = useAppDispatch();
    const combinations = useAppSelector(selectors.selectAll);
    const [currentCombinationId, setCurrentCombinationId] = useState<BachataMachineContextData['currentCombinationId']>(
        getInitialCombinationId(combinations)
    );
    const currentCombination = useAppSelector(state => selectors.selectById(state, currentCombinationId));
    const actorRef = useRef<Actor<typeof machine> | null>(null);
    const [currentPositionId, setCurrentPositionId] =
        useState<BachataMachineContextData['currentPositionId']>(initialPosition);
    const [availableMoves, setAvailableMoves] = useState<BachataMachineContextData['availableMoves']>([]);
    const [movesHistory, setMovesHistory] = useState<BachataMachineContextData['movesHistory']>([]);
    const [currentCount, setCurrentCount] = useState<BachataMachineContextData['currentCount']>(initialCount);

    const updateProviderData = useEvent((snapshot: ReturnType<typeof actorRef.current.getSnapshot>) => {
        const state = snapshot.value as string;
        const [currentPositionId, currentCount] = unpackState(state);
        setCurrentPositionId(currentPositionId);
        setCurrentCount(currentCount);
        setAvailableMoves(
            (Object.keys(TRANSITIONS_CONFIG[state]) as MoveId[]).map(moveId => {
                const nextState = TRANSITIONS_CONFIG[state][moveId];
                const [nextPositionId, nextCount] = unpackState(nextState);
                return { moveId, nextPositionId, nextCount };
            })
        );
        setMovesHistory(
            snapshot.context.history.map(({ moveId, to }) => {
                const [nextPositionId, nextCount] = unpackState(to);
                return { moveId, nextPositionId, nextCount };
            })
        );
    });

    const syncMachineDataWithStore = useEvent((snapshot: ReturnType<typeof actorRef.current.getPersistedSnapshot>) => {
        if (currentCombination) {
            dispatch(updateCombination({ id: currentCombinationId, changes: { snapshot } }));
        } else {
            dispatch(addCombination({ id: currentCombinationId, name: DEFAULT_NAME, snapshot }));
            localStorage.setItem(`${LS_KEY_BASE}:last_combination_id`, String(currentCombinationId));
        }

        dispatch(saveCombinations());
    });

    const renameCurrentCombination = useEvent((name: string) => {
        if (currentCombination) {
            dispatch(updateCombination({ id: currentCombinationId, changes: { name } }));
        } else {
            dispatch(
                addCombination({ id: currentCombinationId, name, snapshot: actorRef.current.getPersistedSnapshot() })
            );
            localStorage.setItem(`${LS_KEY_BASE}:last_combination_id`, String(currentCombinationId));
        }

        dispatch(saveCombinations());
    });

    const createActorFromData = useEvent(() => {
        const actor = currentCombination
            ? createActor(machine, { snapshot: currentCombination.snapshot })
            : createActor(machine);
        actorRef.current = actor;

        return actor;
    });

    useLayoutEffect(() => {
        const actor = createActorFromData();
        actor.start();
        updateProviderData(actor.getSnapshot());
        const { unsubscribe } = actor.subscribe(snapshot => {
            updateProviderData(snapshot);
            syncMachineDataWithStore(actor.getPersistedSnapshot());
        });

        return () => {
            actor.stop();
            unsubscribe();
        };
    }, [currentCombinationId, updateProviderData, syncMachineDataWithStore, createActorFromData]);

    const openCombination = useEvent((combinationId: Combination['id']) => {
        setCurrentCombinationId(combinationId);
        if (combinations.some(({ id }) => id === combinationId)) {
            localStorage.setItem(`${LS_KEY_BASE}:last_combination_id`, String(combinationId));
        }
    });

    const removeCurrentCombination = useEvent(() => {
        if (combinations.some(({ id }) => id === currentCombinationId)) {
            dispatch(removeCombination(currentCombinationId));
            dispatch(saveCombinations());
        }
        const otherCombinations = combinations.filter(({ id }) => id !== currentCombinationId);

        openCombination(otherCombinations.length !== 0 ? otherCombinations[0].id : currentCombinationId !== 0 ? 0 : 1);
    });

    const makeMove = useEvent((moveId: MoveId) => {
        actorRef.current?.send({ type: moveId });
    });

    const undoLastMove = useEvent(() => {
        actorRef.current?.send({ type: COMMAND_ID.UNDO });
    });

    const data = useMemo(
        () => ({
            currentCombinationId,
            openCombination,
            currentPositionId,
            availableMoves,
            makeMove,
            renameCurrentCombination,
            removeCurrentCombination,
            undoLastMove,
            movesHistory,
            currentCount,
        }),
        [
            currentCombinationId,
            openCombination,
            currentPositionId,
            availableMoves,
            makeMove,
            renameCurrentCombination,
            removeCurrentCombination,
            undoLastMove,
            movesHistory,
            currentCount,
        ]
    );

    return <bachataMachineContext.Provider value={data}>{children}</bachataMachineContext.Provider>;
}
