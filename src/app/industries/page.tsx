import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/post-card";
import { INDUSTRIES } from "@/lib/industries";

export default async function IndustriesPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const { industry } = await searchParams;
  const selected =
    industry && (INDUSTRIES as readonly string[]).includes(industry)
      ? industry
      : undefined;

  const resources = selected
    ? await prisma.post.findMany({
        where: { type: "RESOURCE", industry: selected },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true } } },
      })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Industries</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Browse open resources — articles, videos, and more — shared for a
          specific industry.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((option) => (
          <Link
            key={option}
            href={`/industries?industry=${encodeURIComponent(option)}`}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              selected === option
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-black/15 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            }`}
          >
            {option}
          </Link>
        ))}
      </div>

      {!selected ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          Pick an industry above to see resources people have shared.
        </p>
      ) : resources.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          No resources shared for {selected} yet. Be the first to{" "}
          <Link href="/posts/new" className="underline">
            share one
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {resources.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
