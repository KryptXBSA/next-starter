"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const formSchema = z.object({ body: z.string().min(1).max(255) });
export default function NewPost() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { body: "" },
  });

  let utils = api.useUtils();
  const router = useRouter();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      utils.post.getLatest.invalidate();
    },
  });
  const session = useSession();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (session.status === "authenticated") {
      createPost.mutate({ body: values.body });
      form.reset();
      form.setValue("body", "");
    } else {
      toast.error("You're not logged in!");
      router.push("/login");
    }
  }
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-xl space-y-4"
      >
        <div className="mx-auto w-full max-w-xl space-y-4">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-bold">New Post</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={createPost.isLoading}
            className="w-32"
            type="submit"
          >
            Submit
          </Button>
          {createPost.isLoading && <LoadingSpinner />}
        </div>
      </form>
    </Form>
  );
}
