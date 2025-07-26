import { createContext, useContext } from 'react';
import { PositionId, MoveId, Count } from 'src/machine';
import { Combination } from 'src/api/combinations';

export type BachataMachineContextData = {
    currentCombinationId: Combination['id'];
    openCombination: (combinationId: Combination['id']) => void;
    currentPositionId: PositionId;
    availableMoves: {
        moveId: MoveId;
        nextPositionId: PositionId;
        nextCount: Count;
    }[];
    makeMove: (moveId: MoveId) => void;
    undoLastMove: () => void;
    movesHistory: {
        moveId: MoveId;
        nextPositionId: PositionId;
        nextCount: Count;
    }[];
    currentCount: Count;
};

export const bachataMachineContext = createContext<BachataMachineContextData>(null);
export const useBachataMachine = () => useContext(bachataMachineContext);
