"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";
import { flattenZodErrors } from "@/lib/form-errors";
import type { FormState } from "@/lib/actions/auth";

export async function updateProfileAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    headline: formData.get("headline"),
    currentRole: formData.get("currentRole"),
    industry: formData.get("industry"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return { fieldErrors: flattenZodErrors(parsed.error) };
  }

  const { name, headline, currentRole, industry, bio } = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      headline: headline || null,
      currentRole: currentRole || null,
      industry: industry || null,
      bio: bio || null,
    },
  });

  revalidatePath("/profile");
  revalidatePath(`/u/${session.user.id}`);

  return {};
}
