import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient px-4 items-center flex relative rounded-xl gap-1 grow min-h-[56px]">
        <Image
          src={"/assets/icons/search.svg"}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input type='text' placeholder='Search anything globally' value="" className="shadow-none outline-none no-focus paragraph-regular border-none background-light800_darkgradient" />
      </div> 
    </div>
  );
};

export default GlobalSearch;
