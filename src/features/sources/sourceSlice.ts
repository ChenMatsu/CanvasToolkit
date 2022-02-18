import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import Konva from "konva";

interface ImageState {
    x: number;
    y: number;
    src: string;
}

interface SourcesState {
    image: ImageState;
    images: ImageState[];
    transformer: {
        selection: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
    };
    materials: [];
}

const initialState: SourcesState = {
    image: {
        x: 0,
        y: 0,
        src: "",
    },
    images: [],
    transformer: {
        selection: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        },
    },
    materials: [],
};

export const sourcesSlice = createSlice({
    name: "source",
    initialState,
    reducers: {
        onSwitchMaterials: (state, action) => {
            state.materials = action.payload;
        },
        onDrag: (state, action) => {
            state.image.src = action.payload;
        },
        onDrop: (state, action) => {
            state.images.push({
                src: action.payload.src,
                x: action.payload.x,
                y: action.payload.y,
            });
        },
        onDownload: (state, action) => {
            const link = document.createElement("a");
            link.download = Math.random().toString() + ".png";
            link.href = action.payload;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onClickTap: (state, action) => {
            // do we pressed shift or ctrl?
            // const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
            if (!action.payload.isSelected) {
                action.payload.transformer.nodes([action.payload.event.target]);
            }
            const nodes = action.payload.transformer.nodes().concat([action.payload.event.target]);
            action.payload.transformer.nodes(nodes);
            // else if (action.payload.isSelected) {
            //     const nodes = action.payload.transformer.nodes().slice();
            // }

            // if (!metaPressed && !isSelected) {
            // if no key pressed and the node is not selected
            // select just one
            // tr.nodes([e.target]);
            // } else if (metaPressed && isSelected) {
            // if we pressed keys and node was selected
            // we need to remove it from selection:
            // const nodes = tr.nodes().slice(); // use slice to have new copy of array
            // remove node from array
            // nodes.splice(nodes.indexOf(e.target), 1);
            // tr.nodes(nodes);
            // } else if (metaPressed && !isSelected) {
            // add the node into selection
            // const nodes = tr.nodes().concat([e.target]);
            // tr.nodes(nodes);
            // }
            // });
        },
        onMouseDown: (state, action) => {
            state.transformer.selection.x1 = action.payload.stage.getPointerPosition().x;
            state.transformer.selection.y1 = action.payload.stage.getPointerPosition().y;
            state.transformer.selection.x2 = action.payload.stage.getPointerPosition().x;
            state.transformer.selection.y2 = action.payload.stage.getPointerPosition().y;
        },
        onMouseMove: (state, action) => {
            state.transformer.selection.x2 = action.payload.stage.getPointerPosition().x;
            state.transformer.selection.y2 = action.payload.stage.getPointerPosition().y;
        },
        onMouseUp: (state, action) => {
            // const shapes = action.payload.stage.find(".selection-rect");
            // const box = action.payload.selectionRect.getClientRect();
            // const selected = shapes.filter((shape: any) => Konva.Util.haveIntersection(box, shape.getClientRect()));
            // action.payload.transformerRef.nodes(selected);
        },
    },
});

export const { onDrag, onDrop, onSwitchMaterials, onDownload, onClickTap, onMouseDown, onMouseMove, onMouseUp } = sourcesSlice.actions;

export default sourcesSlice.reducer;
