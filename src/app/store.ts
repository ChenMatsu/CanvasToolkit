import { configureStore, combineReducers, ThunkAction, Action } from "@reduxjs/toolkit";
import layoutReducer from "../features/layout/layoutSlice";
import workspaceReducer from "../features/workspace/workspaceSlice";
import sourceReducer from "../features/sources/sourceSlice";

const reducers = combineReducers({
    workspace: workspaceReducer,
    source: sourceReducer,
    layout: layoutReducer,
});

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
