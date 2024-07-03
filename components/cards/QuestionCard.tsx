import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface IQuestionCard {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
  views: number;
  answers: object[];
  upvotes: string[];
  clerkId?: string | null;
}

const QuestionCard = ({
  _id,
  answers,
  author,
  createdAt,
  tags,
  title,
  upvotes,
  views,
  clerkId,
}: IQuestionCard) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 flex line-clamp-1 sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${JSON.parse(_id)}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={_id} />
          )}
        </SignedIn>
      </div>
      <div className="flex flex-wrap mt-3.5 gap-2">
        {tags.map((tag) => (
          <RenderTag _id={tag._id} name={tag.name} key={tag._id} />
        ))}
      </div>
      <div className="flex-between flex-wrap w-full gap-3 mt-6">
        <Metric
          imageUrl={author.picture}
          alt="user"
          title={` asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          value={author.name}
          textStyles="body-medium text-dark400_light700"
        />

        <Metric
          alt="upvotes"
          imageUrl="/assets/icons/like.svg"
          textStyles="small-medium text-dark400_light700"
          title="Votes"
          value={formatAndDivideNumber(upvotes.length)}
        />
        <Metric
          alt="message"
          imageUrl="/assets/icons/message.svg"
          textStyles="small-medium text-dark400_light700"
          title="Answers"
          value={formatAndDivideNumber(answers.length)}
        />
        <Metric
          alt="eye"
          imageUrl="/assets/icons/eye.svg"
          textStyles="small-medium text-dark400_light700"
          title="Views"
          value={formatAndDivideNumber(views)}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
