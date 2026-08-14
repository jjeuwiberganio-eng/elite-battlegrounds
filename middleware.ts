export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/((?!login(?:/|$)).*)",
    "/dashboard/:path*",
    "/organizer/:path*",
    "/moderator/:path*",
  ],
};