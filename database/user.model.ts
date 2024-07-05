import { models, model, Schema, Model } from "mongoose";
import { IUser } from "@/types";
const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    picture: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    portfolioWebsite: {
      type: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true },
);
const User: Model<IUser> = models?.User || model("User", UserSchema);
export default User;
