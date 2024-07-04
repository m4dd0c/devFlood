"use server";
import Question from "@/database/question.model";
import { connectDB } from "../mongoose";
import { SearchParams } from "./shared.types";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import { Model } from "mongoose";
interface IModel {
  model: Model<any>;
  searchField: string;
  type: string;
}
const universalTypes = ["user", "tag", "question", "answer"];
export const globalSearch = async ({ type, query }: SearchParams) => {
  try {
    await connectDB();
    const modelAndTypes: IModel[] = [
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
    ];
    const searchQuery = { $regex: query, $options: "i" };
    const lcType = type ? type.toLowerCase() : "";
    let result = [];
    if (!lcType || !universalTypes.includes(lcType)) {
      // search everywhere
      for (const { model, searchField, type } of modelAndTypes) {
        const res = await model.find({ [searchField]: searchQuery }).limit(2);
        result.push(
          ...res.map((item: any) => ({
            type,
            id:
              type === "answer"
                ? item.question
                : type === "user"
                  ? item.clerkId
                  : item._id,
            title:
              type === "answer"
                ? `Answer containing ${query}`
                : item[
                    searchField
                  ] /* for User and Tag model returning name, for question returning title*/,
          })),
        );
      }
    } else {
      //search in type only
      const typeModel = modelAndTypes.find((item) => item.type === type);
      if (!typeModel) throw new Error("model not found");

      const res = await typeModel.model
        .find({ [typeModel.searchField]: searchQuery })
        .limit(8);

      result = res.map((item: any) => ({
        title:
          type === "answer"
            ? `Answer containing ${query}`
            : item[typeModel.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }
    console.log(result);
    return JSON.stringify(result);
  } catch (error: any) {
    console.error(error?.message);
    throw error;
  }
};
