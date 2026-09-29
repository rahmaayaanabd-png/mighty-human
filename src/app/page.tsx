import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { author: { select: { id: true, name: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Share an experience or resource
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">
          Nothing here yet. Be the first to share your experience or a
          resource.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
