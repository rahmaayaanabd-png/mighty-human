"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { INDUSTRIES } from "@/lib/industries";

type User = {
  name: string;
  headline: string | null;
  currentRole: string | null;
  industry: string | null;
  bio: string | null;
};

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {});

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span>Name</span>
        <input
          name="name"
          defaultValue={user.name}
          required
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        />
        {state.fieldErrors?.name && (
          <span className="text-red-600 dark:text-red-400">
            {state.fieldErrors.name}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span>Headline</span>
        <input
          name="headline"
          defaultValue={user.headline ?? ""}
          placeholder="e.g. Backend engineer switching into product"
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span>Current role</span>
        <input
          name="currentRole"
          defaultValue={user.currentRole ?? ""}
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span>Industry</span>
        <select
          name="industry"
          defaultValue={user.industry ?? ""}
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span>Bio</span>
        <textarea
          name="bio"
          defaultValue={user.bio ?? ""}
          rows={4}
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        />
      </label>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
