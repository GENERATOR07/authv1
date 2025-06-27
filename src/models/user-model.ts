import mongoose from "mongoose";

export type LoginMethod = "magic" | "oauth" | "passkey";

export interface IUser extends mongoose.Document {
  email: string;
  loginMethod: LoginMethod;
  alias?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    loginMethod: {
      type: String,
      enum: ["magic", "oauth", "passkey"],
      required: true,
    },
    alias: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
