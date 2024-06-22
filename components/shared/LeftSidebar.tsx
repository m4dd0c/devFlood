"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { SignedOut } from "@clerk/nextjs";

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="background-light900_dark200 light-border left-0 top-0 sticky h-screen border-r flex flex-col justify-between overflow-y-auto p-6 pt-36 shadow-light-300 max-sm:hidden dark:shadow-none lg:w-[266px] custom-scrollbar">
      <div className="flex-col flex-1 gap-6 h-full flex">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          //TODO: setup profile navigation w/ id
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} bg-transparent gap-4 flex items-center justify-start p-4`}
            >
              <Image
                className={`${isActive ? "" : "invert-colors"}`}
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
              />
              <p
                className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href={"/sign-in"}>
            <Button className="small-medium w-full rounded-lg shadow-none btn-secondary px-4 py-3 min-h-[41px]">
              <Image
                src={"/assets/icons/account.svg"}
                alt="login"
                width={20}
                height={20}
                className="lg:hidden invert-colors"
              />
              <span className="text-primary-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>
          <Link href={"/sign-up"}>
            <Button className="small-medium w-full  text-dark400_light900 rounded-lg shadow-none btn-tertiary light-border-2 px-4 py-3 min-h-[41px]">
              <Image
                src={"/assets/icons/sign-up.svg"}
                alt="sign-up"
                width={20}
                height={20}
                className="lg:hidden invert-colors"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
