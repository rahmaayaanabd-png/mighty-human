import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center gap-2 text-xs text-black/60 dark:text-white/60">
        <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {post.type === "EXPERIENCE" ? "Experience" : "Resource"}
        </span>
        <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
          {post.industry}
        </span>
        {post.resourceKind && (
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

      <h1 className="mt-3 text-2xl font-semibold">{post.title}</h1>

      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        By{" "}
        <Link href={`/u/${post.author.id}`} className="hover:underline">
          {post.author.name}
        </Link>{" "}
        · {post.createdAt.toLocaleDateString()}
      </p>

      <p className="mt-4 whitespace-pre-wrap text-black/80 dark:text-white/80">
        {post.body}
      </p>

      {post.resourceUrl && (
        <a
          href={post.resourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md border border-black/15 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          Open resource ↗
        </a>
      )}

      {post.openToChat && (
        <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <p>{post.author.name} is open to chat about this.</p>
          <a
            href={`mailto:${post.author.email}`}
            className="mt-1 inline-block underline"
          >
            Reach out via email
          </a>
        </div>
      )}
    </article>
  );
}
