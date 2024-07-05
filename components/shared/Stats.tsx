import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";
interface IStatsCard {
  imgUrl: string;
  value: number;
  title: string;
}
const StatsCard = ({ imgUrl, value, title }: IStatsCard) => {
  return (
    <div className="light-border background-light900-dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} alt={title} height={50} width={40} />
      <div className="">
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

interface IStats {
  totalQuestions: number;
  totalAnswers: number;
  badges: {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
  };
  reputation?: number;
}
const Stats = ({
  totalAnswers,
  totalQuestions,
  badges,
  reputation,
}: IStats) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">
        {reputation ? `Stats - ${formatAndDivideNumber(reputation)}` : "Stats"}
      </h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900-dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div className="">
            <p className="paragraph-semibold text-dark200_light900">
              {formatAndDivideNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div className="">
            <p className="paragraph-semibold text-dark200_light900">
              {formatAndDivideNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"
        />
        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
