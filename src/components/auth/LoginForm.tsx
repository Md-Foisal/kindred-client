"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { signIn, useSession } from "@/lib/auth-client";
import { isEmail } from "@/lib/validation";
import { authInputClass, FieldError, FieldLabel, PasswordToggle } from "./AuthShell";
import SocialButtons from "./SocialButtons";

type Errors = { email?: string; password?: string };

// only allow paths inside our own site
function safeRedirect(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = safeRedirect(searchParams.get("redirect"));
  const { data: session, isPending } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const justLoggedIn = useRef(false);

  // already logged in, nothing to do here
  useEffect(() => {
    if (!isPending && session?.user && !justLoggedIn.current) router.replace("/");
  }, [isPending, session, router]);

  function validate(): Errors {
    const next: Errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!isEmail(email.trim())) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    justLoggedIn.current = true;
    const { data, error } = await signIn.email({ email: email.trim(), password });

    if (error) {
      justLoggedIn.current = false;
      setSubmitting(false);
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success(`Welcome back, ${data?.user.name ?? "friend"}!`);
    router.push(redirectTarget);
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={authInputClass(errors.email)}
            value={email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && <FieldError id="email-error">{errors.email}</FieldError>}
        </div>

        <div>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <label className={authInputClass(errors.password)}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              className="grow"
              value={password}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </label>
          {errors.password && <FieldError id="password-error">{errors.password}</FieldError>}
        </div>

        <button type="submit" className="btn-kind h-12! w-full! text-base! disabled:opacity-60" disabled={submitting}>
          {submitting && <span className="loading loading-spinner loading-sm" />}
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="divider my-7 text-sm text-base-content/55">or continue with</div>

      <SocialButtons callbackURL={redirectTarget} />

      <p className="mt-8 text-center text-base-content/70">
        New to Kindred?{" "}
        <Link
          href={redirectTarget !== "/" ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : "/register"}
          className="font-semibold text-base-content underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
