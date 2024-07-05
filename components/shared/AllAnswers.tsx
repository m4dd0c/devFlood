import React from "react";
import Filters from "./Filters";
import { AnswerFilters } from "@/constants/filter";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import Votes from "./Votes";
import ParseHTML from "./ParseHTML";
import { getTimestamp } from "@/lib/utils";
interface IAllAnswers {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}
const AllAnswers = async ({
  questionId,
  page,
  filter,
  totalAnswers,
  userId,
}: IAllAnswers) => {
  const result = await getAnswers({
    page,
    sortBy: filter,
    pageSize: 10,
    questionId,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="text-primary-gradient">{totalAnswers} Answers</h3>
        <Filters filter={AnswerFilters} />
      </div>
      <div>
        {result.answers.map((answer) => (
          <article
            key={JSON.stringify(answer._id)}
            className="light-border border-b py-10"
          >
            <div className="flex items-center justify-between">
              {/* span id */}
              <div className="flex flex-col-reverse mb-8 justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  className="flex flex-1 gap-1 items-start sm:items-center"
                  href={`/profile/${answer.author.clerkId}`}
                >
                  <Image
                    src={answer.author.picture}
                    alt={answer.author.name}
                    height={18}
                    width={18}
                    className="rounded-full object-cove max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="text-dark200_light900">
                      {answer.author.name}
                    </p>
                    <p className="small-regular mt-0.5 line-clamp-1 text-light400_light500">
                      &nbsp;&nbsp;answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  {/* todo: */}
                  <Votes
                    type="Answer"
                    userId={userId}
                    itemId={JSON.stringify(answer._id)}
                    downvotes={answer.downvotes.length}
                    upvotes={answer.upvotes.length}
                    hasDownvoted={answer.downvotes.includes(JSON.parse(userId))}
                    hasUpvoted={answer.upvotes.includes(JSON.parse(userId))}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
