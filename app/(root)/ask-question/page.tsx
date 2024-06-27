import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const {userId} = auth();
  if (!userId) return redirect("/sign-in");
  const user = await getUserById(userId);
  if (!user) return redirect("/sign-in");
  return (
    <div>
      <div>
        <Question userId={JSON.stringify(user?._id)} />
      </div>
    </div>
  );
};

export default page;
