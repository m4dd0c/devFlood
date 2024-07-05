import Profile from "@/components/forms/Profile";
import { toast } from "@/components/ui/use-toast";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Edit Profile | DevFlood",
  description:
    "A platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile development, algorithms, data structure, and more.",
};
const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) {
    toast({
      title: "Login required.",
      description: "You must login first.",
    });
    return redirect("/sign-in");
  }

  const user = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(user)} />
      </div>
    </>
  );
};

export default Page;
