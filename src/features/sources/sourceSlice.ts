import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as CONST from "../../consts";

export interface ImageState {
    x: number;
    y: number;
    src: string;
}

export interface TextState {
    id: number;
    x: number;
    y: number;
    size: number;
    content: string;
}

interface SourcesState {
    // quillRef: ReactQuill | null;
    // currentTextareaRef: React.RefObject<HTMLTextAreaElement>;
    quillRef: any;
    isEditing: boolean;
    isEditingImage: boolean;
    isLoading: boolean;
    imageRef: any;
    image: ImageState;
    images: ImageState[];
    imageColor: {
        red: number;
        green: number;
        blue: number;
        hex: string;
    };
    text: TextState;
    texts: TextState[];
    transformer: {
        selection: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
    };
    materials: { src: string }[];
    currentCategory: string;
}

const initialState: SourcesState = {
    quillRef: {},
    isEditing: false,
    isEditingImage: false,
    isLoading: false,
    image: {
        x: 0,
        y: 0,
        src: "",
    },
    imageRef: null,
    images: [],
    imageColor: {
        red: 0,
        green: 0,
        blue: 0,
        hex: "#000000",
    },
    text: {
        id: 0,
        x: 0,
        y: 0,
        size: 0,
        content: "",
    },
    texts: [],
    transformer: {
        selection: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        },
    },
    materials: [],
    currentCategory: "elements",
};

export const sourcesSlice = createSlice({
    name: "source",
    initialState,
    reducers: {
        onSwitchMaterials: (state, action: PayloadAction<{ categoryItems: [] }>) => {
            state.materials = action.payload.categoryItems;
        },
        onDrag: (state, action) => {
            state.image.src = action.payload;
        },
        onDragText: (state, action: PayloadAction<{ text: string; size: number }>) => {
            state.text.content = action.payload.text;
            state.text.size = action.payload.size;
        },
        onStoreQuill: (state, action: PayloadAction<{ quillRef: any }>) => {
            state.quillRef = action.payload.quillRef;
        },
        onEditText: (state, action: PayloadAction<{ textIdx?: number; isEditing: boolean; text?: string }>) => {
            state.isEditing = action.payload.isEditing;
            state.texts = state.texts.map((text) => {
                if (text.id === action.payload.textIdx) {
                    return {
                        ...text,
                        content: action.payload.text ? action.payload.text : "",
                    };
                }
                return {
                    ...text,
                };
            });
        },
        onDrop: (
            state,
            action: PayloadAction<{ currentCategory: string; id: number; x: number; y: number; content?: string; src?: string; size?: number }>
        ) => {
            switch (action.payload.currentCategory) {
                case CONST.default.SIDER_ITEMS.TEXTS:
                    state.texts.push({
                        id: Math.random(),
                        x: action.payload.x,
                        y: action.payload.y,
                        size: action.payload.size!,
                        content: action.payload.content!,
                    });

                    break;
                default:
                    state.images.push({
                        x: action.payload.x,
                        y: action.payload.y,
                        src: action.payload.src!,
                    });
                    break;
            }
        },
        onUploadImages: (state, action: PayloadAction<string>) => {
            state.materials.push({
                src: action.payload,
            });
        },
        onDownload: (_, action) => {
            const link = document.createElement("a");

            link.download = "ZD-" + new Date().toISOString().split("T")[0] + ".png";
            link.href = action.payload;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onClickTap: (_, action) => {
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
        onContextMenuDelete: (state, action) => {},
        onIsUpdateShape: (state, action: PayloadAction<{ isUpdating: boolean; imageRef?: any }>) => {
            state.isEditingImage = action.payload.isUpdating;

            if (action.payload.imageRef && action.payload.imageRef.current) {
                state.imageRef = action.payload.imageRef.current;
            } else {
                state.imageRef = action.payload.imageRef;
            }
        },
        onUpdateShape: (state, action: PayloadAction<{ red: number; green: number; blue: number; hex: string }>) => {
            state.imageColor.red = action.payload.red;
            state.imageColor.green = action.payload.green;
            state.imageColor.blue = action.payload.blue;
            state.imageColor.hex = action.payload.hex;

            state.imageRef.cache();
            state.imageRef.red(action.payload.red);
            state.imageRef.green(action.payload.green);
            state.imageRef.blue(action.payload.blue);

            // state.isEditingImage = false;
        },
    },
});

export const {
    onDrag,
    onDragText,
    onDrop,
    onStoreQuill,
    onEditText,
    onSwitchMaterials,
    onUploadImages,
    onDownload,
    onClickTap,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onContextMenuDelete,
    onIsUpdateShape,
    onUpdateShape,
} = sourcesSlice.actions;

export default sourcesSlice.reducer;
