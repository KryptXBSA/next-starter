"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function LoginBtn({ loggedIn }: { loggedIn: boolean }) {
  let session = useSession();
  return (
    <>
      {session?.data?.user || loggedIn ? (
        <Link href="/account">My Account</Link>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </>
  );
}
