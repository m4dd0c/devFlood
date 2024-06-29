"use server";
import { connectDB } from "../mongoose";
import User from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
// import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";

export const getUserById = async ({ userId }: GetUserByIdParams) => {
  try {
    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getAllUsers = async ({
  filter,
  page = 1,
  pageSize = 20,
  searchQuery,
}: GetAllUsersParams) => {
  try {
    await connectDB();
    const skipAmount = (page - 1) * pageSize;
    //fixme: type -===== :FilterQuery<sldf>
    const query = searchQuery
      ? {
          $or: [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { username: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {};
    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { createdAt: -1 };
        break;
      case "old_users":
        sortOptions = { createdAt: 1 };
        break;
      case "top_contributor":
        sortOptions = { reputaion: -1 };
      default:
        break;
    }
    const users = await User.find(query)
      .limit(pageSize)
      .skip(skipAmount)
      .sort(sortOptions);
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const updateUser = async ({
  clerkId,
  path,
  updateData,
}: UpdateUserParams) => {
  try {
    await connectDB();
    const user = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    if (!user) throw new Error("User not found");

    revalidatePath(path);
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};
export const createUser = async (userData: CreateUserParams) => {
  try {
    await connectDB();
    const user = await User.create(userData);
    return user;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};
export const deleteUser = async ({ clerkId }: DeleteUserParams) => {
  try {
    await connectDB();
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) throw new Error("User not found");
    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};

export const getSavedQuestions = async ({
  clerkId,
  filter,
  page = 1,
  pageSize = 10,
  searchQuery,
}: GetSavedQuestionsParams) => {
  try {
    await connectDB();
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Question,
      match: query,
      options: { sort: sortOptions, skip: skipAmount, limit: pageSize },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name picture clerkId" },
      ],
    });
    const savedQuestions = user.saved;
    //FIXME: pagination
    const _user = await User.findOne({ clerkId });
    const totalSaved = _user.saved.length;
    const isNext = totalSaved > skipAmount + user.saved.length;
    return { isNext, savedQuestions };
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};
