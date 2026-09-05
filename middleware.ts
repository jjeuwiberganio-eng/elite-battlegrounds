import authMiddleware from "next-auth/middleware";

export default function middleware(
  ...args: Parameters<typeof authMiddleware>
) {
  return authMiddleware(...args);
}

export const config = {
  matcher: [
    "/admin/((?!login(?:/|$)).*)",
    "/dashboard/:path*",
    "/organizer/:path*",
    "/moderator/:path*",
  ],
};
