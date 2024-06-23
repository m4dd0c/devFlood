import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// add public routes here
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
