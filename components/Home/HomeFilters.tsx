"use client";
import { HomePageFilters } from "@/constants/filter";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("filter");
  const [active, setActive] = useState("");
  const handleClick = (item: string) => {
    let newUrl = "";
    if (query === item) {
      setActive("");
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        value: null,
        key: "filter",
      });
    } else {
      setActive(item);
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        value: item.toLowerCase(),
        key: "filter",
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          onClick={() => {
            handleClick(item.value);
          }}
          key={item.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "dark:hover:bg-dark400 bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
