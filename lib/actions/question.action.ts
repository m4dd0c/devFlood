"use server";
import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import Tag from "@/database/tag.model";
import { revalidatePath } from "next/cache";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
// import { FilterQuery } from "mongoose";

export const getQuestions = async ({
  page = 1,
  pageSize = 10,
  searchQuery,
  filter,
}: GetQuestionsParams) => {
  try {
    await connectDB();
    const skipAmount = (page - 1) * pageSize;
    // if searchQuery, using regex w/ or logic otherwise passing {}
    // fixme:  type ==== : FilterQuery<>
    let query: any = searchQuery
      ? {
          $or: [
            {
              title: {
                $regex: new RegExp(searchQuery, "i"),
              },
              content: {
                $regex: new RegExp(searchQuery, "i"),
              },
            },
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

    let questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

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
        { upsert: true, new: true }
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
