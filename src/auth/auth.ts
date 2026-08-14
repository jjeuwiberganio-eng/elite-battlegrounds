import { getServerSession } from "next-auth/next";

import { authConfig } from "./auth.config";

export async function auth() {
  return getServerSession(authConfig);
}