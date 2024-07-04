"use client";
import { GlobalSearchFilters } from "@/constants/filter";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get("type");
  const [active, setActive] = useState(typeParams || "");
  const handleClick = (filter: string) => {
    let newUrl = "";
    if (typeParams === filter) {
      setActive("");
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        value: null,
        key: "type",
      });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        value: filter.toLowerCase(),
        key: "type",
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <button
            type="button"
            key={filter.value}
            className={`light-border-2 small-medium dark:text-light-800 rounded-2xl px-5 py-2 capitalize dark:hover:text-primary-500 ${active === filter.value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"}`}
            onClick={() => handleClick(filter.value)}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilter;
