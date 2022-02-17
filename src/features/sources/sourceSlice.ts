import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

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
};

export const sourcesSlice = createSlice({
    name: "source",
    initialState,
    reducers: {
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
        onMouseDownTouchStart: (state, action) => {
            state.transformer.selection.x1 = action.payload.stage.getPointerPosition().x;
            state.transformer.selection.y1 = action.payload.stage.getPointerPosition().y;
            state.transformer.selection.x2 = action.payload.stage.getPointerPosition().x;
            state.transformer.selection.y2 = action.payload.stage.getPointerPosition().y;

            action.payload.selectionRect.visible(true);
            action.payload.selectionRect.width(0);
            action.payload.selectionRect.height(0);
        },
        onMouseMoveTouchMove: (state, action) => {
            console.log(action.payload);
            state.transformer.selection.x2 = action.payload.stage.getPointerPosition().x;
            state.transformer.selection.y2 = action.payload.stage.getPointerPosition().y;

            action.payload.selectionRect.setAttrs({
                x: Math.min(action.payload.transformer.selection.x1, action.payload.transformer.selection.x2),
                y: Math.min(action.payload.transformer.selection.y1, action.payload.transformer.selection.y2),
                width: Math.abs(action.payload.transformer.selection.x2 - action.payload.transformer.selection.x1),
                height: Math.abs(action.payload.transformer.selection.y2 - action.payload.transformer.selection.y1),
            });
        },
    },
});

export const { onDrag, onDrop, onDownload, onClickTap, onMouseDownTouchStart, onMouseMoveTouchMove } = sourcesSlice.actions;

export default sourcesSlice.reducer;
