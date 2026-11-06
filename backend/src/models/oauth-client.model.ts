import { Schema, model, Document } from "mongoose";

export interface IOAuthClient extends Document {
  clientId: string;
  clientSecretHash: string;
  name: string;
  redirectUris: string[];
  allowedScopes: string[];
  isTrusted: boolean;
  logoUrl?: string;
  description?: string;
  owner?: Schema.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const oauthClientSchema = new Schema<IOAuthClient>(
  {
    clientId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientSecretHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    redirectUris: {
      type: [String],
      required: true,
      validate: {
        validator: (uris: string[]) => uris.length > 0,
        message: "At least one redirect URI is required",
      },
    },
    allowedScopes: {
      type: [String],
      required: true,
      default: ["openid", "profile", "email"],
    },
    isTrusted: {
      type: Boolean,
      default: false,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

oauthClientSchema.index({ name: 1 });

export const OAuthClient = model<IOAuthClient>("OAuthClient", oauthClientSchema);
