import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Question | DevFlood",
  description:
    "A platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile development, algorithms, data structure, and more.",
};
const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;
  const user = await getUserById({ userId });
  if (!user) return null;
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold text-dark-100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          userId={JSON.stringify(user._id)}
          type="Edit"
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
