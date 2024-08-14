import { createSlice } from "@reduxjs/toolkit";

type SidebarTypes = { isOpenOrClose: boolean };

const initialState: SidebarTypes = { isOpenOrClose: false };

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setIsOpenOrClose: (state, action) => {
      state.isOpenOrClose = action.payload;
    },
  },
  selectors: {
    selectSidebar: (sliceState) => sliceState.isOpenOrClose,
  },
});

export const { setIsOpenOrClose } = sidebarSlice.actions;
export const { selectSidebar } = sidebarSlice.selectors;
export default sidebarSlice.reducer;
