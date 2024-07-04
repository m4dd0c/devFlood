"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
interface IPagination {
  pageNumber: number;
  isNext: boolean;
}
const Pagination = ({ pageNumber, isNext }: IPagination) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (dir: "prev" | "next") => {
    const newPageNumber = dir === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: newPageNumber.toString(),
    });
    router.push(newUrl);
  };
  return (
    <div className="w-full gap-2 flex-center">
      <Button
        className="light-border-2 flex-center min-h-[36px] btn gap-2 border"
        disabled={pageNumber == 1}
        onClick={() => handleNavigation("prev")}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>
      <div className="flex-center rounded-md px-3.5 py-2 bg-primary-500">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>

      <Button
        className="light-border-2 flex-center min-h-[36px] btn gap-2 border"
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
