import { model, models, Document, Schema, Model } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
// :Schema<IQuestion>
const QuestionSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    author: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
// : Model<IQuestion>
const Question = models?.Question || model("Question", QuestionSchema);
export default Question;
