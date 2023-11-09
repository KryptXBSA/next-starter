import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex w-full cursor-pointer justify-start px-4 items-center h-16  ">
      <span className="sm:text-xl whitespace-nowrap text-base font-bold">NEXT STARTER</span>
    </Link>
  )
}
