import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/app/profile/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold">Your profile</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        This is what people will see alongside your posts.
      </p>
      <ProfileForm user={user} />
    </div>
  );
}
