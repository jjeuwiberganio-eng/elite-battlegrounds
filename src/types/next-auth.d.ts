import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      displayName: string;
      isSystem: boolean;
      roles: string[];
    };
  }

  interface User {
    id: string;
    username: string;
    displayName: string;
    isSystem: boolean;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    displayName: string;
    isSystem: boolean;
    roles: string[];
  }
}