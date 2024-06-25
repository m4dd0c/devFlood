"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";

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
    console.error(error.message);
    throw error;
  }
};
