import mongoose from "mongoose";

export type LoginMethod = "magic" | "oauth" | "passkey";

export interface IUser extends mongoose.Document {
  email: string;
  loginMethod: LoginMethod;
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
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
