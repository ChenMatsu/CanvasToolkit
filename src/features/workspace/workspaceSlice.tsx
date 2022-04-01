import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
        onSaveCanvas: (_, action: PayloadAction<{ canvasJSON: string }>) => {
            const link = document.createElement("a");

            link.href = URL.createObjectURL(new Blob([action.payload.canvasJSON], { type: "application/json" }));
            link.download = Math.random().toFixed(3) + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    },
});

export const { onStoreStage, onSaveCanvas } = workspaceSlice.actions;

export default workspaceSlice.reducer;
