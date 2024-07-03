import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import { transformIdToString } from "@/lib/utils";

interface IQuestionTab extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ userId, clerkId, searchParams }: IQuestionTab) => {
  const result = await getUserQuestions({
    userId: JSON.parse(userId),
    page: undefined,
    pageSize: undefined,
  });
  return (
    <>
      {result.questions.length > 0 &&
        result.questions.map((question) => (
          <QuestionCard
            key={JSON.stringify(question._id)}
            _id={JSON.stringify(question._id)}
            clerkId={clerkId}
            answers={question.answers}
            author={transformIdToString(question.author)}
            createdAt={question.createdAt}
            tags={transformIdToString(question.tags)}
            title={question.title}
            upvotes={question.upvotes.map((upvote) => upvote.toString())}
            views={question.views}
          />
        ))}
    </>
  );
};

export default QuestionTab;
