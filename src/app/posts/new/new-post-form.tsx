"use client";

import { useActionState, useState } from "react";
import { createPostAction } from "@/lib/actions/posts";
import { INDUSTRIES } from "@/lib/industries";

const RESOURCE_KINDS = ["ARTICLE", "VIDEO", "PODCAST", "TOOL", "OTHER"] as const;

export function NewPostForm() {
  const [state, formAction, pending] = useActionState(createPostAction, {});
  const [type, setType] = useState<"EXPERIENCE" | "RESOURCE">("EXPERIENCE");

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div className="flex gap-2 text-sm">
        {(["EXPERIENCE", "RESOURCE"] as const).map((option) => (
          <label
            key={option}
            className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-center ${
              type === option
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-black/15 dark:border-white/15"
            }`}
          >
            <input
              type="radio"
              name="type"
              value={option}
              checked={type === option}
              onChange={() => setType(option)}
              className="sr-only"
            />
            {option === "EXPERIENCE" ? "Experience" : "Resource"}
          </label>
        ))}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span>Title</span>
        <input
          name="title"
          required
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        />
        {state.fieldErrors?.title && (
          <span className="text-red-600 dark:text-red-400">
            {state.fieldErrors.title}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span>{type === "EXPERIENCE" ? "What happened?" : "Description"}</span>
        <textarea
          name="body"
          rows={5}
          required
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        />
        {state.fieldErrors?.body && (
          <span className="text-red-600 dark:text-red-400">
            {state.fieldErrors.body}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span>Industry</span>
        <select
          name="industry"
          required
          defaultValue=""
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
        >
          <option value="" disabled>
            Select an industry
          </option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {state.fieldErrors?.industry && (
          <span className="text-red-600 dark:text-red-400">
            {state.fieldErrors.industry}
          </span>
        )}
      </label>

      {type === "RESOURCE" && (
        <>
          <label className="flex flex-col gap-1 text-sm">
            <span>Link</span>
            <input
              name="resourceUrl"
              type="url"
              placeholder="https://..."
              className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
            />
            {state.fieldErrors?.resourceUrl && (
              <span className="text-red-600 dark:text-red-400">
                {state.fieldErrors.resourceUrl}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span>Resource type</span>
            <select
              name="resourceKind"
              defaultValue="ARTICLE"
              className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
            >
              {RESOURCE_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {kind[0] + kind.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="openToChat" />
        <span>I&apos;m open to chat about this</span>
      </label>

      {state.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        {pending ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
