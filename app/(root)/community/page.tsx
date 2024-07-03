import UserCard from "@/components/cards/UserCard";
import Filters from "@/components/shared/Filters";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filter";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";
import React from "react";

export default async function Community({ searchParams }: SearchParamsProps) {
  const result = await getAllUsers({
    filter: searchParams.filter,
    page: undefined,
    pageSize: undefined,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="flex justify-between gap-5 max-sm:flex-col items-center mt-11">
        <LocalSearch
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds..."
          otherClasses="flex-1"
        />
        <Filters
          filter={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 gap-4 flex flex-wrap">
        {result.users.length > 0 ? (
          result.users.map((user) => (
            <UserCard
              key={JSON.stringify(user._id)}
              _id={JSON.stringify(user._id)}
              name={user.name}
              username={user.username}
              picture={user.picture}
              clerkId={user.clerkId}
            />
          ))
        ) : (
          <div className="paragraph-regular mx-auto text-dark200_light800 text-center max-w-4xl">
            <p>No user yet</p>
            <Link className="text-accent-blue mt-2 font-bold" href="/sign-up">
              Join to be the first!
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
