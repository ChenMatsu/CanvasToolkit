import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

interface SourceState {}

const initialState: any = {
    value: 0,
    image: {
        src: "",
    },
    images: [],
    status: "idle",
};

export const sourcesSlice = createSlice({
    name: "source",
    initialState,
    reducers: {
        onDrag: (state, action) => {
            state.image.src = action.payload;
        },
        onDrop: (state, action) => {
            console.log(action.payload);
            state.images.push({
                src: action.payload.src,
                x: action.payload.x,
                y: action.payload.y
            });
        },
    },
});

export const { onDrag, onDrop } = sourcesSlice.actions;

export default sourcesSlice.reducer;
