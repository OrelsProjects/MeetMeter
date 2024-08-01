import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import _ from "lodash";
import AppUser, { AppUserSettings } from "../../../models/appUser";
import { CalendarEvents } from "../../../models/calendarEvents";

export interface EventsState {
  events: CalendarEvents | null;
}

export const initialState: EventsState = {
  events: null,
};

const eventsSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarEvents | null>) => {
      state.events = action.payload;
    },
  },
});

export const { setEvents } = eventsSlice.actions;

export const selectEvents = (state: RootState): EventsState => state.events;

export default eventsSlice.reducer;
