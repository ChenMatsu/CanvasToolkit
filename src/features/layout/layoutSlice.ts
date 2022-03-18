import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
    currentCategory: string;
    themeBackgroundColor: string;
}

const initialState: LayoutState = {
    currentCategory: "elements",
    themeBackgroundColor: "#3655b3",
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
        onChangeTheme: (state, action: PayloadAction<{ themeColor: string }>) => {
            state.themeBackgroundColor = action.payload.themeColor;
        },
    },
});

export const { onSiderActive, onChangeTheme } = layoutSlice.actions;

export default layoutSlice.reducer;
