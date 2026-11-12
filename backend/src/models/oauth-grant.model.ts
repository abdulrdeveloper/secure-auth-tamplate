import { Schema, model, Types } from "mongoose";

export interface IOAuthGrant {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  clientId: string;
  scopes: string[];
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const oauthGrantSchema = new Schema<IOAuthGrant>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clientId: { type: String, required: true, index: true },
    scopes: { type: [String], required: true },
    lastUsedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

oauthGrantSchema.index({ user: 1, clientId: 1 }, { unique: true });

export const OAuthGrant = model<IOAuthGrant>("OAuthGrant", oauthGrantSchema);
