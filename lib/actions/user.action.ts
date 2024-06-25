"use server";
import { connectDB } from "../mongoose";
import User from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "./shared.types";
// import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export const getUserById = async (userId: string) => {
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
