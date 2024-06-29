import { Schema, model, Model, models, Document } from "mongoose";

export interface IAnswer extends Document {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
const AnswerSchema = new Schema(
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
const Answer = models?.Answer || model("Answer", AnswerSchema);
export default Answer;
