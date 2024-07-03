import { Schema, model, Model, models, Document } from "mongoose";
import { IInteraction } from "@/types";

const InteractionSchema: Schema<IInteraction> = new Schema(
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
  { timestamps: true },
);
const Interaction: Model<IInteraction> =
  models?.Interaction || model("Interaction", InteractionSchema);
export default Interaction;
