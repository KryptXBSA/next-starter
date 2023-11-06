"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { login } from "@/api/login"
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { GithubIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import DiscordIcon from "@/components/icons/Discord";
import GoogleIcon from "@/components/icons/Google";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", username: "" },
  });

  let router = useRouter();
  function onSubmit(values: z.infer<typeof formSchema>) {
    signIn("credentials", {
      redirect: false,
      ...values,
      callbackUrl: "/",
    }).then((res) => {
      if (res?.ok) router.push("/");
      else toast.error(res?.error);
    });
  }

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-2 py-10">
      <Button
        variant="outline"
        className="flex h-12 w-52 gap-2 rounded-lg "
        onClick={() => signIn("github")}
      >
        <GithubIcon className="h-8 w-8" />
        Login with Github
      </Button>
      <Button
        variant="outline"
        className="flex h-12 w-52 gap-2 rounded-lg "
        onClick={() => signIn("discord")}
      >
        <DiscordIcon className="h-8 w-8" />
        Login with Discord
      </Button>
      <Button
        variant="outline"
        className="flex h-12 w-52 gap-2 rounded-lg "
        onClick={() => signIn("google")}
      >
        <GoogleIcon className="h-8 w-8" />
        Login with Google
      </Button>
      <fieldset className="w-full border-t border-gray-600 sm:w-1/2 md:w-1/3 lg:w-1/4">
        <legend className="mx-auto grow px-2 text-lg text-black dark:text-white ">
          or
        </legend>
      </fieldset>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
          <p className="text-sm text-gray-500">
            If you don't have an account. We'll create one for you.
          </p>
        </form>
      </Form>
    </div>
  );
}
