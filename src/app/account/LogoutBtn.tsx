"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function LogOutBtn() {
  return (
    <Button
      onClick={() => {
        signOut();
        redirect("/");
      }}
    >
      Logout
    </Button>
  );
}
