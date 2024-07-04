"use client";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { globalSearch } from "@/lib/actions/general.action";
import GlobalFilter from "./GlobalFilter";

interface IResult {
  type: string;
  id: string;
  title: string;
}
const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IResult[]>([]);
  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);
      try {
        const data = await globalSearch({ type, query: global });
        setResult(JSON.parse(data));
      } catch (error: any) {
        console.error(error?.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    if (global) fetchResult();
  }, [global, type]);
  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "user":
        return `/profile/${id}`;
      case "answer":
        return `/question/${id}`;
      case "tag":
        return `/tags/${id}`;
      case "question":
        return `/question/${id}`;
      default:
        return "/";
    }
  };
  return (
    <div className="absolute top-full mt-3 z-10 w-full rounded-xl bg-light-800 py-5 shadow-sm">
      <GlobalFilter />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />
      <div className="space-y-5">
        <p className="paragraph-semibold px-5 text-dark400_light900">
          Top Matches
        </p>
        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the entire database.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item, idx: number) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + item.id + idx}
                  className="flex w-full cursor-pointer items-start px-5 gap-3 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tags"
                    className="invert-colors mt-1 object-contain"
                    height={18}
                    width={18}
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, no result found!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default GlobalResult;
