import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true } } },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        {user.headline && (
          <p className="text-black/70 dark:text-white/70">{user.headline}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/60 dark:text-white/60">
          {user.currentRole && (
            <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
              {user.currentRole}
            </span>
          )}
          {user.industry && (
            <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
              {user.industry}
            </span>
          )}
        </div>
        {user.bio && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-black/70 dark:text-white/70">
            {user.bio}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Posts</h2>
        {user.posts.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            No posts yet.
          </p>
        ) : (
          user.posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
