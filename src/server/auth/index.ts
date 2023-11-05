import jwt from "jsonwebtoken";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  DefaultUser,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { DefaultJWT } from "next-auth/jwt";
import { providers } from "./providers";

type User = { id: string; role: string,provider:string };

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    provider: string;
    // ...other properties
    // role: UserRole;
    //
    //
    //
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    user: User;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  cookies: {
    sessionToken: {
      name: `token`,
      options: {
        // httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        // httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  jwt: {
    async encode(p) {
      if (p.token) {
        let token = jwt.sign(p.token, p.secret);
        return token;
      } else throw "no token to encode";
    },
    // @ts-ignore
    async decode(p) {
      if (p.token) {
        let decoded = jwt.verify(p.token, p.secret) as jwt.JwtPayload;
        return decoded;
      } else throw "no token to decode";
    },
  },

  callbacks: {
    async signIn(p) {
      // console.log("callllback signnnnnnnnnnn", p);
      let success = true;
      // let body = {};
      // if (!p.credentials) {
      //   let provider = p.account?.provider;
      //   let username = p.user.name?.replace(/\s/g, "")
      //   let email = p.user.email;
      //   body = {
      //     provider,
      //     username,
      //     name: username,
      //     email,
      //   };
      // } else {
      //   body = {
      //     provider: "credentials",
      //     username: p.credentials.username,
      //     password: p.credentials.password,
      //   };
      // }
      // try {
      //   // @ts-ignore
      //   let createUser = await client.user.createUser.mutate({ ...body });
      //   success = createUser.success;
      //   let userData = createUser.data;
      //   if (typeof createUser.data === "string") {
      //     throw new Error(createUser.data);
      //   }
      //   // @ts-ignore
      // p.user.id='aa'
      // p.user.userData={"id":"asadassd"}
      // } catch (e: any) {}
      return success;
    },

    async jwt(p) {
      // console.log("callllback jwwwwwwwwwwt", p);
      // if (update) {
      //   let { user } = await client.user.getUser.query({
      //     id: p.token.userData.id,
      //   });
      //   //@ts-ignore
      //   p.token.userData = user;
      // } else {
      // p.token.user = p.user
      p.token.user = p.user || p.token.user;
      // }
      // params.token.customData = params.user?.customData || params.token.customData;
      return p.token;
    },
    async session(p) {
      // console.log("callllback sesssssss", p);
      p.session.user = p.token.user;
      return p.session;
      // return {
      //   ...session,
      //   user: {
      //     ...session.user,
      //     id: token.sub,
      //   },
      // };
    },
    // session: ({ session, token }) => ({
    //      ...session,
    //      user: {
    //        ...session.user,
    //        id: token.sub,
    //      },
    //    }),
  },

  providers: providers,
};

export const getServerAuthSession = () => getServerSession(authOptions);
