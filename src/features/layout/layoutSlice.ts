import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
    currentCategory: string;
}

const initialState: LayoutState = {
    currentCategory: "elements",
};

export const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        onSiderActive: (state, action: PayloadAction<{ prevCategory: string; curCategory: string }>) => {
            // ---- Sider Item Selected Style ----
            const prevItem = document.getElementById(action.payload.prevCategory);
            const curItem = document.getElementById(action.payload.curCategory);
            prevItem?.classList.remove("active");
            curItem?.classList.add("active");

            state.currentCategory = action.payload.curCategory;
        },
    },
});

export const { onSiderActive } = layoutSlice.actions;

export default layoutSlice.reducer;
