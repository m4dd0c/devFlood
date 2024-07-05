import QuestionCard from "@/components/cards/QuestionCard";
import { transformIdToString } from "@/lib/utils";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filter";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import { toast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";

export default async function Collection({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  if (!userId) {
    toast({
      title: "Login required.",
      description: "You must login first!",
    });
    return redirect("/sign-in");
  }
  const result = await getSavedQuestions({
    clerkId: userId,
    filter: searchParams.filter,
    page: searchParams?.page ? +searchParams?.page : 1,
    pageSize: searchParams?.pageSize ? +searchParams?.pageSize : 20,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="flex justify-between gap-5 max-sm:flex-col items-center mt-11">
        <LocalSearch
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />
        <Filters
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          filter={QuestionFilters}
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.savedQuestions.length > 0 ? (
          // todo:
          result.savedQuestions.map((question) => (
            <QuestionCard
              key={JSON.stringify(question._id)}
              _id={JSON.stringify(question._id)}
              answers={question.answers}
              author={transformIdToString(question.author)}
              createdAt={question.createdAt}
              tags={transformIdToString(question.tags)}
              title={question.title}
              upvotes={question.upvotes.map((upvote) => upvote.toString())}
              views={question.views}
            />
          ))
        ) : (
          <NoResult
            title="There's no Saved Question to show"
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
