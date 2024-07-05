"use client";
import { Input } from "@/components/ui/input";
import GlobalResult from "./GlobalResult";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrl } from "@/lib/utils";
const GlobalSearch = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("global");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const searchResultsContainerRef = useRef(null);
  // useEffect for actual searching functionality
  useEffect(() => {
    //debounce
    const debounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromUrl({
            keysToRemove: ["global", "type"],
            params: searchParams.toString(),
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);
    return () => clearTimeout(debounceFn);
  }, [search, searchParams, router, pathname, query]);

  // useEffect to close searchResults Container
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchResultsContainerRef.current &&
        //@ts-ignore
        !searchResultsContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    setIsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [pathname]);
  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchResultsContainerRef}
    >
      <div className="background-light800_darkgradient px-4 items-center flex relative rounded-xl gap-1 grow min-h-[56px]">
        <Image
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (isOpen && e.target.value === "") setIsOpen(false);
          }}
          placeholder="Search anything globally"
          className="shadow-none outline-none placeholder no-focus paragraph-regular border-none text-dark400_light700 bg-transparent"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
