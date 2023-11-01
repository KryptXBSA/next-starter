import { User } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import { client } from "./[...nextauth]";
import { env } from "@/env.mjs";

export function getProviders() {
  return [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret:env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Invalid login");
        } else {
          let body: {
            provider: "credentials";
            username: string;
            password: string;
          } = {
            provider: "credentials",
            username: credentials.username,
            password: credentials.password,
          };
          console.log("aaa", body);
          // let createUser = await client.user.createUser.mutate({ ...body });

          // let userData: User = { session:{id:createUser?.data.id} };
          // if (typeof createUser.data === "string") {
          //   throw new Error(createUser.data);
          // }
          console.log("callllback provider");
          // throw new Error("invalid password")
          return { id: "asdsasd", role: "userrr" };
        }
      },
    }),
  ];
}
