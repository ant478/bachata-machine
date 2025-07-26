import { configureStore } from '@reduxjs/toolkit';
import combinations from './slices/combination_slice';

const store = configureStore({
    reducer: {
        combinations,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
