import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

export interface NotificationsState {}

export const initialState: NotificationsState = {};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
});

export const {} = notificationsSlice.actions;

export const selectTemp = (state: RootState): NotificationsState =>
  state.notifications;

export default notificationsSlice.reducer;
