"use client";
// import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

interface IProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: IProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/tags/${_id}`);
  };
  //TODO: FIX HYDRATION AS WELL AS LINKING
  return (
    <div onClick={handleClick} className="flex gap-2 justify-between">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </div>
  );
};

export default RenderTag;
