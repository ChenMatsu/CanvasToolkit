import Konva from "konva";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Stage, Stage as StageInterface } from "konva/lib/Stage";
import { Image as ImageInterface } from "konva/lib/shapes/Image";
import { Rect as RectInterface } from "konva/lib/shapes/Rect";
import { Text as TextInterface } from "konva/lib/shapes/Text";
import { Transformer as TransformerInterface } from "konva/lib/shapes/Transformer";
import { Layer } from "konva/lib/Layer";

interface Workspace {
    stage: StageInterface;
    transformer: TransformerInterface;
    rectangle: RectInterface;
    menu: any;
    currentShape: ImageInterface | TextInterface;
    isImported: boolean;
}

const initialState: Workspace = {
    stage: {} as StageInterface,
    transformer: {} as TransformerInterface,
    menu: {},
    rectangle: {} as RectInterface,
    currentShape: {} as ImageInterface | TextInterface,
    isImported: false,
};

export const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        onStoreStage: (state, action: PayloadAction<{ stage: any }>) => {
            state.stage = action.payload.stage;
        },
        onStoreTransformer: (state, action: PayloadAction<{ transformer: any }>) => {
            state.transformer = action.payload.transformer;
        },
        onStoreRect: (state, action: PayloadAction<{ rect: any }>) => {
            state.rectangle = action.payload.rect;
        },
        onStoreMenu: (state, action: PayloadAction<{ menu: any }>) => {
            state.menu = action.payload.menu;
        },
        onSaveCanvas: (_, action: PayloadAction<{ canvasJSON: string }>) => {
            const link = document.createElement("a");

            link.href = URL.createObjectURL(new Blob([action.payload.canvasJSON], { type: "application/json" }));
            link.download = "ZD-" + new Date().toISOString().split("T")[0] + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onImportCanvas: (state, action: PayloadAction<{ canvasJSON?: File; stageRef: StageInterface }>) => {
            state.isImported = true;
            // const canvasNodes = action.payload.canvasJSON;
            // const reader = new FileReader();
            // reader.readAsText(canvasNodes);
            // reader.onload = async (e) => {
            // const stage = Konva.Stage.create(e.target?.result, "workspace-reuse-container") as StageInterface;
            // // const stageCloned = action.payload.stageRef.clone();
            // // const stageClonedLayer = stageCloned.findOne(".workspace-layer") as Layer;
            // const stageLayer = stage.findOne("Layer") as Layer;
            // stage.find("Image").forEach((imageNode: ImageInterface | any) => {
            //     const nativeImage = new window.Image();
            //     nativeImage.onload = async () => {
            //         imageNode.image(nativeImage);
            //         imageNode.cache();
            //         imageNode.filters([Konva.Filters.RGB]);
            //         // TODO: Does this required in react-konva?
            //         // imageNode.getLayer()?.batchDraw();
            //     };
            //     nativeImage.src = imageNode.getAttr("source");
            // });
            // var itemURL = "";
            // document.getElementById("drag-items").addEventListener("dragstart", function (e) {
            //     itemURL = e.target.src;
            // });
            // var con = stage.container();
            // con.addEventListener("dragover", function (e) {
            //     e.preventDefault(); // !important
            // });
            // con.addEventListener("drop", function (e) {
            //     e.preventDefault();
            //     // now we need to find pointer position
            //     // we can't use stage.getPointerPosition() here, because that event
            //     // is not registered by Konva.Stage
            //     // we can register it manually:
            //     stage.setPointersPositions(e);
            //     Konva.Image.fromURL(itemURL, function (image) {
            //         stageLayer.add(image);
            //         image.position(stage.getPointerPosition());
            //         image.draggable(true);
            //     });
            // });
            // stage.add(stageClonedLayer);
            // const children = stageClonedChildren.getChildren();
            // stage. (children) as StageInterface;
            // combinedStage.findOne(".workspace-layer").destroy();
            // state.stage = combinedStage;
            // stage.id = "workspace-stage-canvas";
            // stage.name = "workspace-stage-canvas";
            // };
            // state.isImported = true;
        },
        onSaveCurrentShape: (state, action) => {
            state.currentShape = action.payload;
        },
    },
});

export const { onStoreStage, onStoreRect, onStoreTransformer, onStoreMenu, onSaveCanvas, onSaveCurrentShape, onImportCanvas } = workspaceSlice.actions;

export default workspaceSlice.reducer;
