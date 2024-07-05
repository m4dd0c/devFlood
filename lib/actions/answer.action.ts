"use server";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";
import { connectDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { IAnswerWithAuthor } from "@/types";
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
    const questionObj = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });
    if (!questionObj) throw new Error("can't find question");
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      tags: questionObj.tags,
      answer: answer._id,
    });
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: 10 },
    });
    revalidatePath(path);
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};
export const getAnswers = async ({
  page = 1,
  sortBy,
  pageSize = 20,
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
        break;
      case "recent":
        filter = { createdAt: -1 };
        break;
      case "old":
        filter = { createdAt: 1 };
        break;
      default:
        break;
    }
    const answers = (await Answer.find({ question: questionId })
      .populate({
        model: User,
        path: "author",
        select: "clerkId _id name picture",
      })
      .sort(filter)
      .limit(pageSize)
      .skip(skipAmount)) as unknown as IAnswerWithAuthor[];

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
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    });
    //increment authors reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });
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
    console.log({ hasDownvoted, hasUpvoted, answerId, userId });
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
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -2 : 2 },
    });
    //increment authors reputation
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    });
    revalidatePath(path);
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};
export const deleteAnswer = async ({ path, answerId }: DeleteAnswerParams) => {
  try {
    await connectDB();

    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer not found!");

    await answer.deleteOne({ _id: answerId });
    await Interaction.deleteMany({ answer: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );

    revalidatePath(path);
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};
