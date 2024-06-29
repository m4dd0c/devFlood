"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export const getTopInteractedTags = async ({
  userId,
  limit = 3,
}: GetTopInteractedTagsParams) => {
  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) throw new Error("user not found");
    //find interaction for user and group by tags...
    // interactions...
    return [
      { _id: "1", name: "TAG_1" },
      { _id: "2", name: "TAG_2" },
      { _id: "3", name: "TAG_3" },
    ];
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};
export const getAllTags = async ({
  filter,
  page = 1,
  pageSize = 10,
  searchQuery,
}: GetAllTagsParams) => {
  try {
    await connectDB();

    const skipAmount = (page - 1) * pageSize;

    const query = searchQuery
      ? {
          $or: [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { description: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {};

    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};

export const getQuestionsByTagId = async ({
  tagId,
  page = 1,
  pageSize = 10,
  searchQuery,
}: GetQuestionsByTagIdParams) => {
  try {
    await connectDB();
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = { createdAt: -1 };
    // TODO: might later
    // switch (filter) {
    //   case "most_recent":
    //     sortOptions = { createdAt: -1 };
    //     break;
    //   case "most_viewed":
    //     sortOptions = { views: -1 };
    //     break;
    //   case "oldest":
    //     sortOptions = { createdAt: 1 };
    //     break;
    //   case "most_voted":
    //     sortOptions = { upvotes: -1 };
    //     break;
    //   case "most_answered":
    //     sortOptions = { answers: -1 };
    //     break;

    //   default:
    //     break;
    // }
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const tag = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      match: query,
      options: { sort: sortOptions, skip: skipAmount, limit: pageSize },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name picture clerkId" },
      ],
    });
    const questions = tag.questions;
    //FIXME: pagination
    const _tag = await Tag.findById(tagId);
    const totalQuestions = _tag.questions.length;
    const isNext = totalQuestions > skipAmount + questions.length;
    return { isNext, questions, tagTitle: tag.name };
  } catch (error: any) {
    console.log(error?.message);
    throw error;
  }
};
