import { createSlice, createEntityAdapter, PayloadAction, EntityState } from '@reduxjs/toolkit';
import { fetchCombinationsApi, pushCombinationsApi, Combination } from 'src/api/combinations';
import { RootState } from '../index';

const adapter = createEntityAdapter<Combination>({
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export type State = {
    loaded: boolean;
    combinations: EntityState<Combination, Combination['id']>;
};

const initialState: State = {
    loaded: false,
    combinations: adapter.getInitialState(),
};

const combination_slice = createSlice({
    name: 'combinations',
    initialState,
    reducers: {
        fetchCombinations(state) {
            let combinations: Combination[] = [];
            try {
                combinations = fetchCombinationsApi();
            } catch {}

            adapter.setAll(state.combinations, combinations);
            state.loaded = true;
        },
        saveCombinations(state) {
            const combinations = adapter.getSelectors().selectAll(state.combinations);
            pushCombinationsApi(combinations);
        },
        addCombination(state, action: PayloadAction<Combination>) {
            adapter.addOne(state.combinations, action.payload);
        },
        addCombinations(state, action: PayloadAction<Combination[]>) {
            adapter.addMany(state.combinations, action.payload);
        },
        updateCombination(state, action: PayloadAction<{ id: Combination['id']; changes: Partial<Combination> }>) {
            adapter.updateOne(state.combinations, action.payload);
        },
        removeCombination(state, action: PayloadAction<Combination['id']>) {
            adapter.removeOne(state.combinations, action.payload);
        },
    },
});

export const {
    fetchCombinations,
    saveCombinations,
    addCombination,
    addCombinations,
    updateCombination,
    removeCombination,
} = combination_slice.actions;

export default combination_slice.reducer;

export const selectors = adapter.getSelectors<RootState>(state => state.combinations.combinations);
