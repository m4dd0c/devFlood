import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IUser {
  clerkId: string;
  name: string;
  username: string;
  picture: string;
}

const UserCard = async ({ clerkId, name, username, picture }: IUser) => {
  return (
    <Link
      href={`/profile/${clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="flex-center w-full light-border background-light900_dark200 flex-col rounded-2xl border p-8">
        <Image
          src={picture}
          alt={username}
          className="rounded-full"
          height={100}
          width={100}
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
