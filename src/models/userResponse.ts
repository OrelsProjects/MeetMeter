import { UserResponse } from "@prisma/client";

export type SendUserResponse = Pick<
  UserResponse,
  "response" | "rating" | "comments"
>;
