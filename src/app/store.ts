import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import layoutReducer from "../features/layout/layoutSlice";
import workspaceReducer from "../features/workspace/workspaceSlice";
import sourceReducer from "../features/sources/sourceSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        workspace: workspaceReducer,
        source: sourceReducer,
        layout: layoutReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
