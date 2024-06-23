import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IMetric {
  imageUrl: string;
  alt: string;
  title: string;
  value: string | number;
  href?: string;
  isAuthor?: boolean;
  textStyles?: string;
}

const Metric = ({
  href,
  alt,
  imageUrl,
  textStyles,
  title,
  value,
  isAuthor,
}: IMetric) => {
  const metricContent = (
    <>
      <Image
        alt={alt}
        src={imageUrl}
        width={16}
        height={16}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }
  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
