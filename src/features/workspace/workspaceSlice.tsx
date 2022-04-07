import Konva from "konva";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Stage as StageInterface } from "konva/lib/Stage";
import { Image as ImageInterface } from "konva/lib/shapes/Image";
import { Text as TextInterface } from "konva/lib/shapes/Text";
import { Layer } from "konva/lib/Layer";

interface Workspace {
    stage: StageInterface;
    currentShape: ImageInterface | TextInterface;
    isImported: boolean;
}

const initialState: Workspace = {
    stage: {} as StageInterface,
    currentShape: {} as ImageInterface | TextInterface,
    isImported: false,
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
            link.download = "ZD-" + new Date().toISOString().split("T")[0] + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onImportCanvas: (_, action: PayloadAction<{ canvasJSON: File; stageRef: StageInterface }>) => {
            const canvasNodes = action.payload.canvasJSON;
            const reader = new FileReader();
            reader.readAsText(canvasNodes);
            reader.onload = async (e) => {
                const stage = Konva.Stage.create(e.target?.result, "workspace-reuse-container");
                const stageCloned = action.payload.stageRef.clone();
                const stageClonedLayer = stageCloned.findOne(".workspace-layer") as Layer;

                stage.find("Image").forEach((imageNode: ImageInterface) => {
                    const nativeImage = new window.Image();
                    nativeImage.onload = async () => {
                        imageNode.image(nativeImage);
                        imageNode.cache();
                        imageNode.filters([Konva.Filters.RGB]);

                        // TODO: Does this required in react-konva?
                        // imageNode.getLayer()?.batchDraw();
                    };
                    nativeImage.src = imageNode.getAttr("source");
                });
                stage.add(stageClonedLayer);
                // const children = stageClonedChildren.getChildren();

                // stage. (children) as StageInterface;
                // combinedStage.findOne(".workspace-layer").destroy();

                // state.stage = combinedStage;

                // stage.id = "workspace-stage-canvas";
                // stage.name = "workspace-stage-canvas";
            };
            // state.isImported = true;
        },
        onSaveCurrentShape: (state, action) => {
            state.currentShape = action.payload;
        },
    },
});

export const { onStoreStage, onSaveCanvas, onSaveCurrentShape, onImportCanvas } = workspaceSlice.actions;

export default workspaceSlice.reducer;
