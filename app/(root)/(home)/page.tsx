import HomeFilters from "@/components/Home/HomeFilters";
import Pagination from "@/components/shared/Pagination";
import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";
import { transformIdToString } from "@/lib/utils";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Home | DevFlood",
  description:
    "A platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile development, algorithms, data structure, and more.",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  let result: any = {
    questions: [],
    isNext: false,
  };
  if (searchParams?.filter?.toLowerCase() === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        page: searchParams?.page ? +searchParams?.page : 1,
        pageSize: searchParams?.pageSize ? +searchParams?.pageSize : 20,
        searchQuery: searchParams.q,
        userId,
      });
    }
  } else {
    result = await getQuestions({
      filter: searchParams.filter,
      page: searchParams?.page ? +searchParams?.page : 1,
      pageSize: searchParams?.pageSize ? +searchParams?.pageSize : 20,
      searchQuery: searchParams.q,
    });
  }

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
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={JSON.stringify(question._id)}
              _id={JSON.stringify(question._id)}
              answers={question.answers}
              author={transformIdToString(question.author)}
              createdAt={question.createdAt}
              tags={transformIdToString(question.tags)}
              title={question.title}
              upvotes={question.upvotes.map((upvote: any) => upvote.toString())}
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
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams?.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}
