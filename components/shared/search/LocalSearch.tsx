"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
interface ILocalSearch {
  route: string;
  imgSrc: string;
  iconPosition: "left" | "right";
  otherClasses?: string;
  placeholder: string;
}

const LocalSearch = ({
  iconPosition,
  imgSrc,
  otherClasses,
  placeholder,
  route,
}: ILocalSearch) => {
  return (
    <div
      className={`bg-light800_darkgradient flex min-h-[56px] grow items-center px-4 rounded-[10px] ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search Icon"
          height={24}
          width={24}
          className="cursor-pointer"
        />
      )}
      <Input
        placeholder={placeholder}
        type="text"
        value={""}
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />
  {iconPosition === "right" && (
    <Image
      src={imgSrc}
      alt="Search Icon"
      height={24}
      width={24}
      className="cursor-pointer"
    /> 
  )}
    </div>
  );
};

export default LocalSearch;
