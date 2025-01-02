import { configureStore } from '@reduxjs/toolkit';
import kilpailuListaReducer from './kilpailutSlice';

export const store = configureStore({
    reducer: {
        kilpailuLista : kilpailuListaReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;