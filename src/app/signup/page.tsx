"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, {});

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Share your journey and connect with others navigating their careers.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <Field label="Name" name="name" error={state.fieldErrors?.name} />
        <Field
          label="Email"
          name="email"
          type="email"
          error={state.fieldErrors?.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          error={state.fieldErrors?.password}
        />

        {state.error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {pending ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required
        className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/15 dark:focus:border-white/40"
      />
      {error && <span className="text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
