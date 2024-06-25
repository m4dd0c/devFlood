import { models, model, Schema, Document, Model } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  createdOn: Date;
  followers: Schema.Types.ObjectId[];
}
const TagSchema: Schema<ITag> = new Schema({
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
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  followers: [{ ref: "User", type: Schema.Types.ObjectId }],
  questions: [{ ref: "Question", type: Schema.Types.ObjectId }],
});
const Tag: Model<ITag> = models.Tag || model("Tag", TagSchema);
export default Tag;
