"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromUrl } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ILocalSearch {
  route: string;
  imgSrc: string;
  iconPosition: "left" | "right";
  otherClasses?: string;
  placeholder: string;
}

const LocalSearch = ({
  iconPosition,
  imgSrc,
  otherClasses,
  placeholder,
  route,
}: ILocalSearch) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  useEffect(() => {
    //debounce
    const debounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrl({
            keysToRemove: ["q"],
            params: searchParams.toString(),
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);
    return () => clearTimeout(debounceFn);
  }, [search, searchParams, route, router, pathname, query]);
  return (
    <div
      className={`bg-light800_darkgradient flex min-h-[56px] grow items-center px-4 rounded-[10px] ${otherClasses} gap-4`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search Icon"
          height={24}
          width={24}
          className="cursor-pointer"
        />
      )}
      <Input
        placeholder={placeholder}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="Search Icon"
          height={24}
          width={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
