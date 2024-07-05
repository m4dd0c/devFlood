import Question from "@/components/forms/Question";
import { toast } from "@/components/ui/use-toast";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Ask a Question | DevFlood",
  description:
    "A platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers around the world. Explore topics in web development, mobile development, algorithms, data structure, and more.",
};
const page = async () => {
  const { userId } = auth();
  if (!userId) {
    toast({
      title: "Login required.",
      description: "You must login first!",
    });
    return redirect("/sign-in");
  }
  const user = await getUserById({ userId });
  if (!user) {
    toast({
      title: "Login Required.",
      description: "You must login first!",
    });
    return redirect("/sign-in");
  }
  return (
    <div>
      <div>
        <Question userId={JSON.stringify(user._id)} />
      </div>
    </div>
  );
};

export default page;
