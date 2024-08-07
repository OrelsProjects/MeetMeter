import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import _, { update } from "lodash";
import { CalendarEvents } from "../../../models/calendarEvents";
import { UserResponseWithEvent } from "../../../models/userResponse";
import { UserResponse } from "@prisma/client";

type EventId = string;

export interface EventsState {
  events: CalendarEvents | null;
  userEventResponses: UserResponseWithEvent[];
}

export const initialState: EventsState = {
  events: null,
  userEventResponses: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarEvents | null>) => {
      state.events = action.payload;
    },
    setUserEventResponses: (
      state,
      action: PayloadAction<UserResponseWithEvent[]>,
    ) => {
      state.userEventResponses = action.payload;
    },
    setEventNotified: (
      state,
      action: PayloadAction<{ eventId: EventId; canNotifyAt: Date | "now" }>,
    ) => {
      if (!state.events) return;
      const index = state.events.items.findIndex(
        event => event.id === action.payload.eventId,
      );
      if (index === -1) {
        return;
      } else {
        state.events.items[index].canNotifyAt = action.payload.canNotifyAt;
      }
    },

    updateResponse: (
      state,
      action: PayloadAction<{
        responseId: string;
        response: UserResponse;
      }>,
    ) => {
      const index = state.userEventResponses.findIndex(
        response => response.responseEventId === action.payload.responseId,
      );
      if (index === -1) {
        return;
      } else {
        state.userEventResponses[index] = {
          ...state.userEventResponses[index],
          ...action.payload.response,
        };
      }
    },
  },
});

export const {
  setEvents,
  setUserEventResponses,
  setEventNotified,
  updateResponse,
} = eventsSlice.actions;

export const selectEvents = (state: RootState): EventsState => state.events;

export default eventsSlice.reducer;
