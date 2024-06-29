import { Schema, model, Model, models, Document } from "mongoose";

export interface IInteraction extends Document {
  action: string;
  user: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  answer: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}
const InteractionSchema = new Schema(
  {
    user: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
    action: {
      trim: true,
      required: true,
      type: String,
    },
    question: {
      ref: "Question",
      type: Schema.Types.ObjectId,
    },
    answer: {
      ref: "Answer",
      type: Schema.Types.ObjectId,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);
const Interaction =
  models?.Interaction || model("Interaction", InteractionSchema);
export default Interaction;
