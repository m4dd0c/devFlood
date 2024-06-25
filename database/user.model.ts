import { models, model, Schema, Document, Model } from "mongoose";
export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  picture: string;
  location?: string;
  password?: string;
  reputation?: number;
  portfolioWebsite?: string;
  saved: Schema.Types.ObjectId[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
// : Schema<IUser>
const UserSchema = new Schema({
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
  password: {
    type: String,
    minlength: 8,
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
});
// : Model<IUser>
const User = models.User || model("User", UserSchema);
export default User;
