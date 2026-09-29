import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export async function Nav() {
  const session = await auth();

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          mighty-human
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="hover:underline">
            Feed
          </Link>
          <Link href="/industries" className="hover:underline">
            Industries
          </Link>
          {session?.user ? (
            <>
              <Link href="/posts/new" className="hover:underline">
                New post
              </Link>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-black/60 hover:text-black hover:underline dark:text-white/60 dark:hover:text-white"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-black px-3 py-1.5 text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
