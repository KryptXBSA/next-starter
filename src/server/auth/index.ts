import jwt from "jsonwebtoken";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  DefaultUser,
} from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { providers } from "./providers";
import { UserData } from "./types";
import { db } from "../db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User extends DefaultUser, UserData {}
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    user: UserData;
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
      let success = true;
      try {
        if (!p.credentials && p.account?.provider) {
          let provider = p.account?.provider;
          // trim username
          let username = p.user.name?.replace(/\s/g, "") || "";
          let email = p.user.email;

          // find user in the database
          const user = await db.user.findFirst({
            where: { username },
          });

          // if there is user, set the user data
          if (user) {
            p.user.id = user.id;
            p.user.provider = user.provider;
            p.user.username = user.username;
            // else create a new user and set the user data
          } else {
            const newUser = await db.user.create({
              data: {
                username: username,
                provider: provider,
                email,
              },
            });

            p.user.id = newUser.id;
            p.user.provider = newUser.provider;
            p.user.username = newUser.username;
          }
        }
      } catch (error) {
        console.error(error);
        success = false;
      }
      return success;
    },

    async jwt(params) {
      // at first we get the user data from params.user, then we get the user data fro, params.token.user
      params.token.user = params.user || params.token.user;
      return params.token;
    },
    async session(p) {
      p.session.user = p.token.user;
      return p.session;
    },
  },

  providers: providers,
};

export const getServerAuthSession = () => getServerSession(authOptions);
