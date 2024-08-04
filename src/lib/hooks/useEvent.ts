"use client";
import { ResponseEvent, UserResponse } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import LoadingError from "../../models/errors/LoadingError";
import { SendUserResponse } from "../../models/userResponse";

export default function useEvent() {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);


  return {};
}
