import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface IQuestionTab extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ userId, clerkId, searchParams }: IQuestionTab) => {
  const result = await getUserQuestions({
    userId,
    page: undefined,
    pageSize: undefined,
  });
  return (
    <>
      {result.questions.length > 0 &&
        result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            clerkId={clerkId}
            _id={JSON.stringify(question._id)}
            answers={question.answers}
            author={question.author}
            createdAt={question.createdAt}
            tags={question.tags}
            title={question.title}
            upvotes={question.upvotes}
            views={question.views}
          />
        ))}
    </>
  );
};

export default QuestionTab;
