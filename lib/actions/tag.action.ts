"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams } from "./shared.types";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import { ITagQuestions } from "@/types";

export const getAllTags = async ({
  filter,
  page = 1,
  pageSize = 20,
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
        sortOptions = { name: 1 };
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
    console.error(error);
    throw error;
  }
};

export const getQuestionsByTagId = async ({
  tagId,
  page = 1,
  pageSize = 20,
  searchQuery,
}: GetQuestionsByTagIdParams) => {
  try {
    await connectDB();
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = { createdAt: -1 };
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const tag = (await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      match: query,
      options: { sort: sortOptions, skip: skipAmount, limit: pageSize },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name picture clerkId" },
      ],
    })) as unknown as ITagQuestions;
    if (!tag) throw new Error("Tag not found");
    const questions = tag.questions;
    const _tag = await Tag.findById(tagId);
    if (!_tag) throw new Error("Tag not found");
    const totalQuestions = _tag.questions.length;
    const isNext = totalQuestions > skipAmount + questions.length;
    return { isNext, questions, tagTitle: tag.name };
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
export const getPopularTags = async () => {
  try {
    await connectDB();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numOfQuestions: { $size: "$questions" } } },
      { $limit: 5 },
      { $sort: { numOfQuestions: -1 } },
    ]);
    return popularTags;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
