import { models, model, Schema, Document, Model } from "mongoose";
import { ITag } from "@/types";

const TagSchema: Schema<ITag> = new Schema(
  {
    name: {
      unique: true,
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    followers: [{ ref: "User", type: Schema.Types.ObjectId }],
    questions: [{ ref: "Question", type: Schema.Types.ObjectId }],
  },
  { timestamps: true },
);
const Tag: Model<ITag> = models?.Tag || model("Tag", TagSchema);
export default Tag;
