"use server";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";

export const createAnswer = async ({
  content,
  author,
  question,
  path,
}: CreateAnswerParams) => {
  try {
    await connectDB();
    const answer = await Answer.create({
      content,
      author,
      question,
    });
    // adding answer to question
    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });
    // TODO: interaction
    revalidatePath(path);
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};
export const getAnswers = async ({
  page = 1,
  sortBy,
  pageSize = 10,
  questionId,
}: GetAnswersParams) => {
  try {
    await connectDB();
    const skipAmount = (page - 1) * pageSize;
    let filter = {};
    switch (sortBy) {
      case "highestUpvotes":
        filter = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        filter = { upvotes: 1 };
      case "newest":
        filter = { createdAt: -1 };
      case "old":
        filter = { createdAt: 1 };
      default:
        break;
    }
    const answers = await Answer.find({ question: questionId })
      .populate({
        model: User,
        path: "author",
        select: "clerkId _id name picture",
      })
      .sort(filter)
      .limit(pageSize)
      .skip(skipAmount);
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skipAmount + answers.length;
    return { answers, isNext };
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};

export const downvoteAnswer = async ({
  hasDownvoted,
  hasUpvoted,
  path,
  answerId,
  userId,
}: AnswerVoteParams) => {
  try {
    await connectDB();
    let updateQuery = {};
    if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found!");
    //increment authors reputation
    revalidatePath(path);
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};
export const upvoteAnswer = async ({
  hasDownvoted,
  hasUpvoted,
  path,
  answerId,
  userId,
}: AnswerVoteParams) => {
  try {
    await connectDB();
    let updateQuery = {};
    if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found!");
    //increment authors reputation
    revalidatePath(path);
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};
