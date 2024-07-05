import React from "react";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/shared/ProfileLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDate } from "@/lib/utils";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
import { redirect } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | DevFlood",
  description:
    "A platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile development, algorithms, data structure, and more.",
};
const page = async ({ params, searchParams }: URLProps) => {
  const userInfo = await getUserInfo({ userId: params.id });
  const { userId } = auth();
  if (!userId) {
    toast({
      title: "Login required.",
      description: "You must login first.",
    });
    return redirect("/sign-in");
  }

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo.user.picture}
            alt={userInfo.user.username}
            height={200}
            width={200}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>
            <div className="flex items-center justify-start gap-5 flex-wrap mt-4">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  href={userInfo.user.portfolioWebsite}
                  imgUrl="/assets/icons/link.svg"
                  title="Portfolio"
                />
              )}
              {userInfo.user.location && (
                <ProfileLink
                  href={`https://www.google.co.in/maps/place/${userInfo.user.location}`}
                  imgUrl="/assets/icons/location.svg"
                  title="Location"
                />
              )}

              <ProfileLink
                href={userInfo.user.createdAt.toString()}
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${getJoinedDate(userInfo.user.createdAt)}`}
              />
            </div>
            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-2">
          <SignedIn>
            {userId === userInfo.user.clerkId && (
              <Link href={`/profile/edit/${userInfo.user._id}`}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        badges={userInfo.badgeCount}
        reputation={userInfo.user?.reputation}
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="flex flex-col w-full mt-5 gap-6"
          >
            <QuestionTab
              userId={JSON.stringify(userInfo.user._id)}
              clerkId={userId} // it is from clerk auth()
              searchParams={searchParams}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab
              userId={JSON.stringify(userInfo.user._id)}
              clerkId={userId} // it is from clerk auth()
              searchParams={searchParams}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
