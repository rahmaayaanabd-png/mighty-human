"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { postSchema } from "@/lib/validation";
import { flattenZodErrors } from "@/lib/form-errors";
import type { FormState } from "@/lib/actions/auth";

export async function createPostAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const parsed = postSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    body: formData.get("body"),
    industry: formData.get("industry"),
    openToChat: formData.get("openToChat") === "on",
    resourceUrl: formData.get("resourceUrl"),
    resourceKind: formData.get("resourceKind"),
  });

  if (!parsed.success) {
    return { fieldErrors: flattenZodErrors(parsed.error) };
  }

  const data = parsed.data;

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      type: data.type,
      title: data.title,
      body: data.body,
      industry: data.industry,
      openToChat: data.openToChat,
      resourceUrl: data.type === "RESOURCE" ? data.resourceUrl || null : null,
      resourceKind:
        data.type === "RESOURCE" && data.resourceKind
          ? data.resourceKind
          : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/industries");
  redirect(`/posts/${post.id}`);
}
