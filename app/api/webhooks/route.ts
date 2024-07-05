import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  try {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error(
        "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
      );
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      try {
        const userData = {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          username: evt.data.username!,
          name: `${evt.data.first_name} ${evt.data.last_name ? evt.data.last_name : ""}`,
          picture: evt.data.image_url,
        };
        const user = await createUser(userData);
        return NextResponse.json({ message: "OK", user });
      } catch (error) {
        console.error("webhook.user.created:", error);
      }
    }
    if (eventType === "user.updated") {
      try {
        const updateData = {
          name: `${evt.data.first_name}${evt.data.last_name ? ` ${evt.data.last_name}` : ""}`,
          username: evt.data.username!,
          email: evt.data.email_addresses[0].email_address,
          picture: evt.data.image_url,
        };

        const user = await updateUser({
          clerkId: evt.data.id,
          path: `/profile/${evt.data.id}`,
          updateData,
        });
        return NextResponse.json({ message: "OK", user });
      } catch (error) {
        console.error("webhook.user.updated:", error);
      }
    }
    if (eventType === "user.deleted") {
      try {
        const user = await deleteUser({ clerkId: evt.data.id! });
        return NextResponse.json({ message: "OK", user });
      } catch (error) {
        console.error("webhook.user.deleted:", error);
      }
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("WEBHOOK_ERR:", error);
  }
}
