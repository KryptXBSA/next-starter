import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/env.mjs";
import { authorize } from "./authorize";

export const providers = [
  GithubProvider({
    clientId: env.GITHUB_ID,
    clientSecret: env.GITHUB_SECRET,
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
      password: {
        label: "Password",
        type: "password",
        placeholder: "Password",
      },
    },
    authorize: authorize,
  }),
];
