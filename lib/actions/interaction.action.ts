"use server";
import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export const viewQuestion = async ({
  questionId,
  userId,
}: ViewQuestionParams) => {
  try {
    await connectDB();
    await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    });
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (existingInteraction) return console.log("user already exist!");
      // interaction creation
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
