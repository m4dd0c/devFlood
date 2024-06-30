"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
interface IEditDeleteAction {
  type: "Answer" | "Question";
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: IEditDeleteAction) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async () => {
    if (type === "Question") {
      //delete Question
      await deleteQuestion({ path: pathname, questionId: JSON.parse(itemId) });
    } else {
      await deleteAnswer({ path: pathname, answerId: JSON.parse(itemId) });
      //delete Answer
    }
  };
  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`);
  };
  return (
    <div className="flex justify-end items-center gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src={"/assets/icons/edit.svg"}
          alt="edit icon"
          height={14}
          width={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <Image
        src={"/assets/icons/trash.svg"}
        alt="delete icon"
        height={14}
        width={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
