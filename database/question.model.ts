import { model, models, Document, Schema, Model } from "mongoose";
import { IQuestion } from "@/types";

const QuestionSchema: Schema<IQuestion> = new Schema(
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
  { timestamps: true },
);
const Question: Model<IQuestion> =
  models?.Question || model("Question", QuestionSchema);
export default Question;
