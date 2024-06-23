import HomeFilters from "@/components/Home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import Link from "next/link";
import React from "react";

const questions = [
  {
    _id: "1",
    title: "Cascading with Javascript in webpage?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "html" },
      { _id: "4", name: "css" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "john-doe.png",
    },
    views: 232,
    answers: [],
    upvotes: 23,
    createdAt: new Date("2020-02-03T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "Redux toolkit not working as expected?",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "jsx" },
      { _id: "4", name: "css" },
    ],
    author: {
      _id: "2",
      name: "Jane Doe",
      picture: "jane-doe.png",
    },
    views: 23,
    answers: [],
    upvotes: 3,
    createdAt: new Date("2020-07-03T12:00:00.000Z"),
  },
  {
    _id: "3",
    title:
      "Reactjs vs Nextjs, which one I should use for my upcoming project and why?",
    tags: [
      { _id: "1", name: "reactjs" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "nextjs" },
      { _id: "4", name: "tailwindcss" },
    ],
    author: {
      _id: "3",
      name: "Anibal Cortest",
      picture: "anibal-cortest.png",
    },
    views: 1122,
    answers: [],
    upvotes: 613,
    createdAt: new Date("2021-02-03T12:00:00.000Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row  sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="flex justify-between gap-5 max-sm:flex-col items-center mt-11">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />
        <Filters
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
          filter={HomePageFilters}
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          // todo:
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              answers={question.answers}
              author={question.author}
              createdAt={question.createdAt}
              tags={question.tags}
              title={question.title}
              upvotes={question.upvotes}
              views={question.views}
            />
          ))
        ) : (
          <NoResult
            title="There's no Question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. Our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
