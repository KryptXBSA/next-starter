import { Post, User } from "@prisma/client";
import { FormattedDate } from "./FormattedDate";

type Props = {
  createdBy: User;
} & Post;

export default function Post(props: Props) {
  return (
    <article className="mr-auto">
      <h2 className="text-2xl font-semibold">{props.createdBy.username}</h2>
      <p className="text-zinc-500 text-sm dark:text-zinc-400" suppressHydrationWarning>
        <FormattedDate date={props.createdAt} />
      </p>
      <p className="mt-1">{props.body}</p>
    </article>
  );
}
