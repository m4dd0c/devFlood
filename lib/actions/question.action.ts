"use server";
import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import Tag from "@/database/tag.model";
import { revalidatePath } from "next/cache";
import {
  CreateQuestionParams,
  GetQuestionsParams,
  GetQuestionByIdParams,
  QuestionVoteParams,
  ToggleSaveQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
} from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { IGetQuestions, IQuestionWithAuthorTag } from "@/types";
import { ObjectId } from "mongoose";
// import { FilterQuery } from "mongoose";

export const getQuestions = async ({
  page = 1,
  pageSize = 20,
  searchQuery,
  filter,
}: GetQuestionsParams) => {
  try {
    await connectDB();
    const skipAmount = (page - 1) * pageSize;
    let query: any = searchQuery
      ? {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {};

    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;

      default:
        break;
    }

    let questions = (await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)) as unknown as IGetQuestions[];

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;
    return { questions, isNext };
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const createQuestion = async ({
  title,
  content,
  author,
  tags,
  path,
}: CreateQuestionParams) => {
  try {
    await connectDB();
    let question = await Question.create({
      title,
      content,
      author,
    });
    const documentTags = [];
    // for each tag in tags
    for (const tag of tags) {
      /* 
    if there is already present a tag document w/ specific name, append question._id to it 
    otherwise create a new one set its name:tag and push question._id to it 
    */
      const newTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );
      documentTags.push(newTag._id);
    }
    await question.updateOne({
      tags: documentTags,
    });
    revalidatePath(path);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getQuestionById = async ({
  questionId,
}: GetQuestionByIdParams) => {
  try {
    await connectDB();
    const question = (await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })) as unknown as IQuestionWithAuthorTag;
    return question;
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};

export const downvoteQuestion = async ({
  hasDownvoted,
  hasUpvoted,
  path,
  questionId,
  userId,
}: QuestionVoteParams) => {
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) throw new Error("Question not found!");
    //increment authors reputation
    revalidatePath(path);
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};

export const upvoteQuestion = async ({
  hasDownvoted,
  hasUpvoted,
  path,
  questionId,
  userId,
}: QuestionVoteParams) => {
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) throw new Error("Question not found!");
    //increment authors reputation
    revalidatePath(path);
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};

export const toggleSaveQuestion = async ({
  path,
  questionId,
  userId,
}: ToggleSaveQuestionParams) => {
  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) throw new Error("user not found!");

    let updateQuery = {};
    if (user.saved.includes(questionId as unknown as ObjectId)) {
      updateQuery = { $pull: { saved: questionId } };
    } else {
      updateQuery = { $addToSet: { saved: questionId } };
    }
    await User.updateOne({ _id: userId }, updateQuery, { new: true });
    revalidatePath(path);
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};
export const deleteQuestion = async ({
  path,
  questionId,
}: DeleteQuestionParams) => {
  try {
    await connectDB();
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { question: questionId },
      { $pull: { questions: questionId } },
    );
    revalidatePath(path);
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};

export const editQuestion = async ({
  path,
  questionId,
  content,
  title,
}: EditQuestionParams) => {
  try {
    await connectDB();
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found!");
    question.title = title;
    question.content = content;
    await question.save();
    revalidatePath(path);
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};
export const getHotQuestions = async () => {
  try {
    await connectDB();
    const questions = await Question.find()
      .sort({ upvotes: -1, views: -1 })
      .limit(5);
    return questions;
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};
