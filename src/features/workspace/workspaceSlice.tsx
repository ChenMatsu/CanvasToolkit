import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { Stage as StageType } from "konva/lib/Stage";

interface Workspace {
    stage: StageType;
}

const initialState: Workspace = {
    stage: {} as StageType,
};

export const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        onStoreStage: (state, action) => {
            state.stage = action.payload;
        },
    },
});

export const { onStoreStage } = workspaceSlice.actions;

export default workspaceSlice.reducer;
