"use client";
import { ResponseEvent, UserResponse } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import LoadingError from "../../models/errors/LoadingError";
import { SendUserResponse } from "../../models/userResponse";

export default function useResponse() {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const getEventResponse = async (
    responseId: string,
  ): Promise<{
    responseEvent: ResponseEvent;
    userResponse: UserResponse;
  }> => {
    if (loadingFetch) throw new LoadingError("Loading...");
    setLoadingFetch(true);
    try {
      const response = await axios.get<{
        responseEvent: ResponseEvent;
        userResponse: UserResponse;
      }>(`/api/eventResponse/${responseId}`);

      return response.data;
    } catch (error: any) {
      throw error;
    } finally {
      setLoadingFetch(false);
    }
  };

  const sendResponse = async (
    responseId: string,
    response: SendUserResponse,
  ) => {
    if (loadingSend) throw new LoadingError("Loading...");
    setLoadingSend(true);
    try {
      await axios.post(`/api/eventResponse/${responseId}/response`, {
        response,
      });
    } catch (error: any) {
      throw error;
    } finally {
      setLoadingSend(false);
    }
  };

  return { getEventResponse, sendResponse, loadingSend, loadingFetch };
}
