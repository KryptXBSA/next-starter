import Link from "next/link";

import { Logo } from "@/components/Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center space-x-4 lg:container sm:justify-between sm:space-x-0">
        <div className="flex  flex-1 items-center justify-between">
          <div className="flex  items-center gap-6">
            <Logo />
            {/* <Link href="/link">link</Link> */}
          </div>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </header>
  );
}
