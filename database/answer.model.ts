import { Schema, model, Model, models } from "mongoose";
import { IAnswer } from "@/types";

const AnswerSchema: Schema<IAnswer> = new Schema(
  {
    author: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
    question: {
      ref: "Question",
      required: true,
      type: Schema.Types.ObjectId,
    },
    content: {
      trim: true,
      required: true,
      minlength: 100,
      type: String,
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
  },
  { timestamps: true },
);
const Answer: Model<IAnswer> = models?.Answer || model("Answer", AnswerSchema);
export default Answer;
