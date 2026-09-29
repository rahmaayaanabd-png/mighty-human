import Link from "next/link";

type PostCardData = {
  id: string;
  type: "EXPERIENCE" | "RESOURCE";
  title: string;
  body: string;
  industry: string;
  openToChat: boolean;
  resourceUrl: string | null;
  resourceKind: string | null;
  createdAt: Date;
  author: { id: string; name: string };
};

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-2 text-xs text-black/60 dark:text-white/60">
        <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {post.type === "EXPERIENCE" ? "Experience" : "Resource"}
        </span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {post.industry}
        </span>
        {post.type === "RESOURCE" && post.resourceKind && (
          <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
            {post.resourceKind}
          </span>
        )}
        {post.openToChat && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Open to chat
          </span>
        )}
      </div>

      <h3 className="mt-2 text-lg font-semibold">
        <Link href={`/posts/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>

      <p className="mt-1 line-clamp-3 text-sm text-black/70 dark:text-white/70">
        {post.body}
      </p>

      <div className="mt-3 flex items-center justify-between text-xs text-black/50 dark:text-white/50">
        <Link href={`/u/${post.author.id}`} className="hover:underline">
          {post.author.name}
        </Link>
        <time dateTime={post.createdAt.toISOString()}>
          {post.createdAt.toLocaleDateString()}
        </time>
      </div>
    </article>
  );
}
