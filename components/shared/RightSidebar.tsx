import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const RightSidebar = () => {
  const hotQuestions = [
    { _id: "1", title: "What is Javascript?" },
    {
      _id: "2",
      title: "How can I use Shadcn in ReactJS + vite, Is that even possible?",
    },
    { _id: "3", title: "Cascading disappread after deploying to vercel." },
    {
      _id: "4",
      title:
        "Best practices for data fetching in Nextjs application with server side rendering?",
    },
    {
      _id: "5",
      title:
        "How to perfectly center a div in any framework using tailwind css?",
    },
  ];
  const popularTags = [
    { _id: "1", name: "javascript", totalQuestions: 5 },
    { _id: "2", name: "cpp", totalQuestions: 35 },
    { _id: "3", name: "python", totalQuestions: 55 },
    { _id: "4", name: "reactjs", totalQuestions: 5345 },
    { _id: "5", name: "nextjs", totalQuestions: 577 },
  ];
  return (
    <section className="background-light900_dark200 light-border right-0 top-0 sticky h-screen border-l flex flex-col overflow-y-auto p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none lg:w-[350px] custom-scrollbar">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 w-full flex flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              key={question._id}
              href={`/questions/${question._id}`}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src={"/assets/icons/chevron-right.svg"}
                alt="chevron-right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
