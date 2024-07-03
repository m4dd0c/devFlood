import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import { Badge } from "../ui/badge";

interface IUser {
  _id: string;
  clerkId: string;
  name: string;
  username: string;
  picture: string;
}

const UserCard = async ({ _id, clerkId, name, username, picture }: IUser) => {
  const interactedTags = await getTopInteractedTags({
    userId: JSON.parse(_id),
    limit: 3,
  });
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
        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag _id={tag._id} name={tag.name} key={tag._id} />
              ))}
            </div>
          ) : (
            <Badge>No tag yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
