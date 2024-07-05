import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { TagFilters, UserFilters } from "@/constants/filter";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Tags | DevFlood",
  description:
    "A platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile development, algorithms, data structure, and more.",
};
export default async function Tags({ searchParams }: SearchParamsProps) {
  const result = await getAllTags({
    filter: searchParams.filter,
    searchQuery: searchParams.q,
    page: searchParams?.page ? +searchParams?.page : 1,
    pageSize: searchParams?.pageSize ? +searchParams?.pageSize : 20,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="flex justify-between gap-5 max-sm:flex-col sm:items-center mt-11">
        <LocalSearch
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags..."
          otherClasses="flex-1"
        />
        <Filters
          filter={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 gap-4 flex flex-wrap">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={JSON.stringify(tag._id)}
              className="shadow-light100-darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col border rounded-2xl px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold text-primary-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tag Found."
            description="It looks like there is no tag yet made."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination
          isNext={result.isNext}
          pageNumber={searchParams?.page ? +searchParams?.page : 1}
        />
      </div>
    </>
  );
}
