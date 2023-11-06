import { getServerAuthSession } from "@/server/auth";
import { LoginForm } from "./LoginForm";
import { redirect } from "next/navigation";

export default async function Page() {
  let session = await getServerAuthSession();
  if (session?.user) redirect("/");
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <LoginForm />
    </section>
  );
}
