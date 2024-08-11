"use client";
import { ResponseEvent, UserResponse } from "@prisma/client";
import axios from "axios";
import { useRef, useState } from "react";
import LoadingError from "../../models/errors/LoadingError";
import {
  SendUserResponse,
  UserResponseWithEvent,
} from "../../models/userResponse";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  selectEvents,
  setUserEventResponses,
  updateResponse,
} from "../features/events/eventsSlice";

export default function useResponse() {
  const dispatch = useAppDispatch();
  const { userEventResponses } = useAppSelector(selectEvents);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const loadingFetchRef = useRef(false);
  const loadingSendRef = useRef(false);

  const getUserEventResponses = async () => {
    if (loadingFetchRef.current) throw new LoadingError("Loading...");
    loadingFetchRef.current = true;
    setLoadingFetch(true);
    try {
      const response =
        await axios.get<UserResponseWithEvent[]>("/api/userResponse");
      dispatch(setUserEventResponses(response.data));
      return response.data;
    } catch (error: any) {
      throw error;
    } finally {
      loadingFetchRef.current = false;
      setLoadingFetch(false);
    }
  };

  const getEventResponse = async (
    responseId: string,
  ): Promise<{
    responseEvent: ResponseEvent;
    userResponse: UserResponse;
  }> => {
    if (loadingFetchRef.current) throw new LoadingError("Loading...");
    loadingFetchRef.current = true;
    setLoadingFetch(true);
    try {
      const event = userEventResponses.find(
        response => response.responseEventId === responseId,
      );
      if (event) {
        return {
          responseEvent: event.responseEvent,
          userResponse: event,
        };
      }
      const response = await axios.get<{
        responseEvent: ResponseEvent;
        userResponse: UserResponse;
      }>(`/api/eventResponse/${responseId}`);

      return response.data;
    } catch (error: any) {
      throw error;
    } finally {
      loadingFetchRef.current = false;
      setLoadingFetch(false);
    }
  };

  const sendResponse = async (
    responseId: string,
    response: SendUserResponse,
  ) => {
    if (loadingSendRef.current) throw new LoadingError("Loading...");
    loadingSendRef.current = true;
    setLoadingSend(true);
    try {
      const result = await axios.post<UserResponse>(
        `/api/eventResponse/${responseId}/response`,
        {
          response,
        },
      );
      dispatch(updateResponse({ responseId, response: result.data }));
    } catch (error: any) {
      throw error;
    } finally {
      loadingSendRef.current = false;
      setLoadingSend(false);
    }
  };

  return {
    getEventResponse,
    getUserEventResponses,
    sendResponse,
    loadingSend,
    loadingFetch,
  };
}
