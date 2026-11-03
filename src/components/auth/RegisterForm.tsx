"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/ImageUpload";
import { signUp, useSession } from "@/lib/auth-client";
import { isEmail, isUrl, passwordProblem } from "@/lib/validation";
import { authInputClass, FieldError, FieldLabel, PasswordToggle } from "./AuthShell";
import SocialButtons from "./SocialButtons";

type Field = "name" | "email" | "image" | "password";
type Errors = Partial<Record<Field, string>>;

const rules = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
];

// only allow paths inside our own site
function safeRedirect(value: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}

export default function RegisterForm() {
  const router = useRouter();
  // people sent here from a private page go back there after signing up
  const redirectTarget = safeRedirect(useSearchParams().get("redirect"));
  const { data: session, isPending } = useSession();

  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [brokenPhoto, setBrokenPhoto] = useState("");
  const justSignedUp = useRef(false);

  useEffect(() => {
    if (!isPending && session?.user && !justSignedUp.current) router.replace("/");
  }, [isPending, session, router]);

  function update(field: Field, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    // the old message goes away as soon as they start fixing it
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Name needs at least 2 characters";
    if (!isEmail(form.email.trim())) next.email = "Enter a valid email address";
    if (!isUrl(form.image.trim())) next.image = "Enter a valid photo URL (http or https)";
    const pwProblem = passwordProblem(form.password);
    if (pwProblem) next.password = pwProblem;
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (found.password) toast.error(found.password);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    justSignedUp.current = true;
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      image: form.image.trim(),
      password: form.password,
    });

    if (error) {
      justSignedUp.current = false;
      setSubmitting(false);
      toast.error(error.message || "Could not create your account");
      return;
    }

    toast.success("Account created, welcome to Kindred!");
    router.push(redirectTarget);
    router.refresh();
  }

  const photo = form.image.trim();
  const photoOk = isUrl(photo) && brokenPhoto !== photo;
  const described = (field: Field, help?: string) => (errors[field] ? `${field}-error` : help);

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <input
            id="name"
            autoComplete="name"
            placeholder="Your full name"
            className={authInputClass(errors.name)}
            value={form.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={described("name")}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
        </div>

        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={authInputClass(errors.email)}
            value={form.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={described("email")}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email && <FieldError id="email-error">{errors.email}</FieldError>}
        </div>

        <div>
          <FieldLabel htmlFor="image">Photo URL</FieldLabel>
          <label className={authInputClass(errors.image)}>
            <span className="relative -ml-1 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-base-200 text-base-content/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
              {photoOk && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setBrokenPhoto(photo)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </span>
            <input
              id="image"
              type="url"
              placeholder="https://example.com/me.jpg"
              className="grow"
              value={form.image}
              aria-invalid={Boolean(errors.image)}
              aria-describedby={described("image", "image-help")}
              onChange={(e) => update("image", e.target.value)}
            />
          </label>
          <ImageUpload onUploaded={(url) => update("image", url)} />
          {errors.image ? (
            <FieldError id="image-error">{errors.image}</FieldError>
          ) : (
            <p id="image-help" className="mt-2 text-sm text-base-content/55">
              Upload a photo or paste a link. It shows next to events you host.
            </p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <label className={authInputClass(errors.password)}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="grow"
              value={form.password}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={described("password", "password-rules")}
              onChange={(e) => update("password", e.target.value)}
            />
            <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </label>
          {errors.password && <FieldError id="password-error">{errors.password}</FieldError>}

          {/* live checklist so people know what is missing */}
          <ul id="password-rules" className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2" aria-label="Password needs">
            {rules.map((rule) => {
              const ok = rule.test(form.password);
              return (
                <li
                  key={rule.label}
                  className={`flex items-center gap-2 transition-colors ${ok ? "text-success" : "text-base-content/55"}`}
                >
                  <span
                    className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border transition ${
                      ok ? "border-success bg-success text-success-content" : "border-current"
                    }`}
                    aria-hidden
                  >
                    {ok && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="size-2.5">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  {rule.label}
                  <span className="sr-only">{ok ? ", done" : ", not yet"}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <button type="submit" className="btn-kind h-12! w-full! text-base! disabled:opacity-60" disabled={submitting}>
          {submitting && <span className="loading loading-spinner loading-sm" />}
          {submitting ? "Creating your account..." : "Create account"}
        </button>
      </form>

      <div className="divider my-7 text-sm text-base-content/55">or continue with</div>

      <SocialButtons callbackURL={redirectTarget} />

      <p className="mt-8 text-center text-base-content/70">
        Already have an account?{" "}
        <Link
          href={redirectTarget !== "/" ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : "/login"}
          className="font-semibold text-base-content underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
