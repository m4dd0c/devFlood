import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import { transformIdToString } from "@/lib/utils";

interface IAnswerTab extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ userId, clerkId, searchParams }: IAnswerTab) => {
  const result = await getUserAnswers({
    userId: JSON.parse(userId),
    page: searchParams.page ? +searchParams.page : 1,
    pageSize: searchParams.pageSize ? +searchParams.pageSize : 20,
  });
  return (
    <>
      {result.answers.length > 0 &&
        result.answers.map((answer) => (
          <AnswerCard
            key={JSON.stringify(answer._id)}
            _id={JSON.stringify(answer._id)}
            clerkId={clerkId}
            upvotes={answer.upvotes.length}
            createdAt={answer.createdAt}
            author={transformIdToString(answer.author)}
            question={transformIdToString(answer.question)}
          />
        ))}
    </>
  );
};

export default AnswerTab;
