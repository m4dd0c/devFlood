import { models, model, Schema, Document, Model } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  createdOn: Date;
  followers: Schema.Types.ObjectId[];
}
// ITag FIXME:
const TagSchema = new Schema(
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
  { timestamps: true }
);
const Tag = models?.Tag || model("Tag", TagSchema);
export default Tag;
