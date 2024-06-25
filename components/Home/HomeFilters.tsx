"use client"
import { HomePageFilters } from "@/constants/filter";
import React from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          onClick={() => {}}
          key={item.value}
          className={`${active === item.value ? "bg-primary-100 text-primary-500" : "text-light-500 bg-light-800"} body-medium rounded-lg px-6 py-3 capitalize shadow-none`}
        ></Button>
      ))}
    </div>
  );
};

export default HomeFilters;
