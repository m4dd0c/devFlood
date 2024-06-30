import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";

interface IAnswerTab extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ userId, clerkId, searchParams }: IAnswerTab) => {
  const result = await getUserAnswers({
    userId,
    page: undefined,
    pageSize: undefined,
  });
  return (
    <>
      {result.answers.length > 0 &&
        result.answers.map((answer) => (
          <AnswerCard
            question={answer.question}
            key={answer._id}
            clerkId={clerkId}
            _id={JSON.stringify(answer._id)}
            author={answer.author}
            createdAt={answer.createdAt}
            upvotes={answer.upvotes}
          />
        ))}
    </>
  );
};

export default AnswerTab;
