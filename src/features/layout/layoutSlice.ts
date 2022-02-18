import { createSlice } from "@reduxjs/toolkit";

interface LayoutState {
    siderItem: string;
}

const initialState: LayoutState = {
    siderItem: "elements",
};

export const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        onSiderActive: (state, action) => {
            // ---- Sider Item Selected Style ----
            const prevItem = document.getElementById(action.payload.prevItem);
            const curItem = document.getElementById(action.payload.curItem);
            prevItem?.classList.remove("active");
            curItem?.classList.add("active");

            state.siderItem = action.payload.curItem;
        },
    },
});

export const { onSiderActive } = layoutSlice.actions;

export default layoutSlice.reducer;
