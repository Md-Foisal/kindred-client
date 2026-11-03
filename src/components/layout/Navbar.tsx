"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SOCIAL_LOGIN_KEY } from "@/components/auth/SocialButtons";
import { clearToken } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
];

const privateLinks = [
  { href: "/create-event", label: "Create Event" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
  { href: "/profile", label: "My Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  // if the photo url is broken we show the first letter instead
  const [avatarFailed, setAvatarFailed] = useState(false);

  // google/github login comes back with a full page redirect, so greet the user here
  useEffect(() => {
    if (isPending || !user) return;
    let startedAt: string | null = null;
    try {
      startedAt = sessionStorage.getItem(SOCIAL_LOGIN_KEY);
      sessionStorage.removeItem(SOCIAL_LOGIN_KEY);
    } catch {}
    if (startedAt && Date.now() - Number(startedAt) < 15 * 60 * 1000) {
      // wait a moment so the toaster below is ready to show it
      const name = user.name || "friend";
      setTimeout(() => toast.success(`Welcome back, ${name}!`), 300);
    }
  }, [isPending, user]);

  async function handleLogout() {
    await signOut();
    clearToken();
    toast.success("You are logged out. See you soon!");
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // the active link gets a short bar that sits right on the bottom hairline
  const linkClass = (href: string) =>
    `relative flex h-full items-center px-3 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:transition-opacity ${
      isActive(href)
        ? "text-base-content after:bg-base-content after:opacity-100"
        : "text-base-content/65 hover:text-base-content after:opacity-0"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-content/10 bg-base-100/75 backdrop-blur-xl backdrop-saturate-150">
      {/* very small phones (under 380px) get a smaller menu button and wordmark so nothing is cut off */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 max-[380px]:px-3 sm:gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] max-[380px]:[&_.btn-circle]:size-9 max-[380px]:[&_a[aria-label='Kindred_home']>span]:text-[1.3rem]">
        <div className="flex items-center gap-1">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-circle -ml-2" aria-label="Open menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
                <path d="M4 7h16M4 12h10M4 17h16" />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-60 gap-0.5 rounded-box border border-base-300 bg-base-100 p-2 shadow-[0_24px_60px_-24px_rgb(23_21_61/0.35)]"
            >
              {publicLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={isActive(l.href) ? "menu-active" : ""}>
                    {l.label}
                  </Link>
                </li>
              ))}
              {/* on phones the theme switch lives here so the bar has room */}
              <li className="mt-1 border-t border-base-300 pt-1 sm:hidden">
                <ThemeToggle variant="menu" />
              </li>
            </ul>
          </div>
          <Logo />
        </div>

        <ul className="hidden h-16 items-stretch gap-2 lg:flex">
          {publicLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkClass(l.href)} aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          {isPending ? (
            <div className="skeleton size-9 rounded-full" />
          ) : user ? (
            <>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="avatar tooltip tooltip-bottom cursor-pointer rounded-full"
                  data-tip={user.name}
                  aria-label="Open profile menu"
                >
                  <div className="size-9 rounded-full ring-1 ring-base-content/15 ring-offset-2 ring-offset-base-100 transition hover:ring-base-content/40">
                    {user.image && !avatarFailed ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarFailed(true)}
                      />
                    ) : (
                      <span className="bg-sunrise grid size-full place-items-center font-display text-sm font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  tabIndex={0}
                  className="dropdown-content z-50 mt-3 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-[0_24px_60px_-24px_rgb(23_21_61/0.35)]"
                >
                  <div className="border-b border-base-300 px-3 pb-3 pt-2">
                    <p className="truncate font-display text-base font-bold tracking-tight">{user.name}</p>
                    <p className="truncate text-xs text-base-content/60">{user.email}</p>
                  </div>
                  <ul className="menu w-full gap-0.5 px-0 pb-0 pt-2">
                    {privateLinks.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={pathname === l.href ? "menu-active" : ""}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-kind-ghost btn-sm px-3.5! sm:px-6!">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-kind btn-sm px-3.5! sm:px-6!">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
