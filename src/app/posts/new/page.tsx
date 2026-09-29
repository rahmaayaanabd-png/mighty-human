import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NewPostForm } from "@/app/posts/new/new-post-form";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold">Share something</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Post an experience from your career journey, or share a resource
        (article, video, etc.) for others in a specific industry.
      </p>
      <NewPostForm />
    </div>
  );
}
