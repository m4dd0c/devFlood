"use client";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  toggleSaveQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "../ui/use-toast";

interface IVotes {
  type: "Question" | "Answer";
  userId: string;
  itemId: string;
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  downvotes,
  hasDownvoted,
  hasUpvoted,
  itemId,
  type,
  upvotes,
  userId,
  hasSaved,
}: IVotes) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleVote = async (vote: "upvote" | "downvote") => {
    if (!userId) {
      return toast({
        title: "Login required.",
        description: "You must login first.",
      });
    }
    if (vote === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          hasDownvoted,
          hasUpvoted,
          path: pathname,
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      } else {
        await upvoteAnswer({
          hasDownvoted,
          hasUpvoted,
          path: pathname,
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      }
      return toast({
        title: `Upvote ${!hasUpvoted ? "Successful" : "Removed"}`,
        variant: !hasUpvoted ? "default" : "destructive",
      });
    } else {
      if (type === "Question") {
        await downvoteQuestion({
          hasDownvoted,
          hasUpvoted,
          path: pathname,
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      } else {
        await downvoteAnswer({
          hasDownvoted,
          hasUpvoted,
          path: pathname,
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
        });
      }

      return toast({
        title: `Downvote ${!hasDownvoted ? "Successful" : "Removed"}`,
        variant: !hasDownvoted ? "default" : "destructive",
      });
    }
  };
  const handleSave = async () => {
    if (!userId) return null;
    await toggleSaveQuestion({
      path: pathname,
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    });
    return toast({
      title: `Question ${!hasSaved ? "Saved in" : "Removed from"} your collection`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [router, pathname, userId, itemId]);
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            height={18}
            width={18}
            className="cursor-pointer"
            onClick={() => {
              handleVote("upvote");
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            height={18}
            width={18}
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          height={18}
          width={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};
export default Votes;
