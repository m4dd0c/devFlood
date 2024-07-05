import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface INoResult {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ description, link, linkTitle, title }: INoResult) => {
  return (
    <div className="flex flex-col w-full mt-10 items-center justify-center">
      <Image
        src={"/assets/images/light-illustration.png"}
        alt="light-illustration"
        height={200}
        width={270}
        className="flex object-contain dark:hidden"
      />
      <Image
        src={"/assets/images/dark-illustration.png"}
        alt="dark-illustration"
        height={200}
        width={270}
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 max-w-md text-center my-3.5">
        {description}
      </p>
      <Link href={link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
