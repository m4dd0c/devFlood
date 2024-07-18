"use client";
import React from "react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

interface IProps {
  _id: string;
  name: string;
  numOfQuestions?: number;
  showCount?: boolean;
}
const RenderTag = ({ _id, name, numOfQuestions, showCount }: IProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/tags/${JSON.parse(_id)}`);
  };
  return (
    <div
      onClick={handleClick}
      className="flex gap-2 justify-between cursor-pointer"
    >
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{numOfQuestions}</p>
      )}
    </div>
  );
};

export default RenderTag;
