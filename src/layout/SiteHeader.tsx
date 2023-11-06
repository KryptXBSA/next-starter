
import { getServerAuthSession } from "@/server/auth";
import { Logo } from "@/components/Logo";
import { LoginBtn } from "./LoginBtn";

export async function SiteHeader() {
  let session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center space-x-4 lg:container sm:justify-between sm:space-x-0">
        <div className="flex  flex-1 items-center justify-between">
          <div className="flex  items-center gap-6">
            <Logo />
          </div>
          <LoginBtn loggedIn={session?.user !== undefined} />
        </div>
      </div>
    </header>
  );
}
