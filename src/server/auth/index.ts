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


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User extends DefaultUser,UserData {
  }
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

    async jwt(params) {
      // at first we get the user data from params.user, then we get the user data fro, params.token.user
      params.token.user = params.user || params.token.user;
      return params.token;
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
