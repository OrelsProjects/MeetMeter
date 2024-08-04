import { ResponseEvent, UserResponse } from "@prisma/client";

export type SendUserResponse = Pick<
  UserResponse,
  "response" | "rating" | "comments"
>;

export type UserResponseWithEvent = UserResponse & { responseEvent: ResponseEvent };
