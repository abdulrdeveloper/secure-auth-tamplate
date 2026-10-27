import type { HydratedDocument } from "mongoose";
import type { User } from "../models/user.model.js";

export function toPublicUser(user: HydratedDocument<User>) {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}
