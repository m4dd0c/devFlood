import React from "react";
import RenderTag from "@/components/shared/RenderTag";
import Link from "next/link";
import Answer from "@/components/forms/Answer";
import Image from "next/image";
import { getQuestionById } from "@/lib/actions/question.action";
import Metric from "@/components/shared/Metric";
import { getTimestamp, formatAndDivideNumber } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import AllAnswers from "@/components/shared/AllAnswers";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import Votes from "@/components/shared/Votes";

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { pageSize?: string; page?: string; filter?: string };
}) => {
  const { userId } = auth();
  if (!userId) return null;

  const user = await getUserById({ userId });
  if (!user) return null;

  const result = await getQuestionById({ questionId: params.id });
  if (!result) return null;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex gap-1 items-center justify-start"
          >
            <Image
              src={result.author.picture}
              alt={result.author.name}
              className="rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              userId={JSON.stringify(user._id)}
              itemId={JSON.stringify(result._id)}
              downvotes={result.downvotes.length}
              hasDownvoted={result.downvotes.includes(user._id)}
              upvotes={result.upvotes.length}
              hasUpvoted={result.upvotes.includes(user._id)}
              hasSaved={user?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imageUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={getTimestamp(result.createdAt)}
          title=" Asked"
          textStyles="body-medium text-dark400_light800"
        />

        <Metric
          alt="message"
          imageUrl="/assets/icons/message.svg"
          textStyles="small-medium text-dark400_light800"
          title=" Answers"
          value={formatAndDivideNumber(result.answers.length)}
        />
        <Metric
          alt="eye"
          imageUrl="/assets/icons/eye.svg"
          textStyles="small-medium text-dark400_light800"
          title=" Views"
          value={formatAndDivideNumber(result.views)}
        />
      </div>
      <ParseHTML data={result.content} />

      <div className="mt-8 gap-2 flex flex-wrap">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={JSON.stringify(tag._id)}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <AllAnswers
        questionId={params.id}
        totalAnswers={result.answers.length}
        userId={JSON.stringify(user._id)}
      />
      <Answer
        question={result.content}
        authorId={JSON.stringify(user._id)}
        questionId={JSON.stringify(result._id)}
      />
    </>
  );
};

export default page;
