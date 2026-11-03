"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/ImageUpload";
import { clearToken } from "@/lib/api";
import { authClient, useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";
import { isUrl } from "@/lib/validation";
import { authInputClass, FieldError, FieldLabel } from "./AuthShell";

// photo if we have a working one, otherwise the first letter on the sunrise gradient
function Avatar({ name, image, className }: { name: string; image?: string | null; className: string }) {
  const [broken, setBroken] = useState("");
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sunrise font-display font-extrabold text-white ${className}`}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
      {image && broken !== image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setBroken(image)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}

const wrap = "mx-auto max-w-3xl px-4 pt-6 pb-24 sm:pt-10";
const card = "rounded-[1.75rem] border border-base-300 bg-base-100 shadow-[0_30px_80px_-50px_rgb(23_21_61/0.5)]";
const iconBtn = "grid size-9 shrink-0 place-items-center rounded-full transition disabled:opacity-50";
const coverHeight = "h-36 sm:h-52";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1600&q=70";
const cameraPath = "M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z";

function CameraIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={cameraPath} />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}

// the user's own cover, or the community photo tinted with the sunrise colours
function Cover({ src, className = coverHeight }: { src?: string | null; className?: string }) {
  const [broken, setBroken] = useState("");
  const own = src && broken !== src ? src : "";
  return (
    <div className={`relative overflow-hidden bg-night ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={own || DEFAULT_COVER}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => own && setBroken(own)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!own && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#5b3df5]/70 via-[#d63af9]/35 to-[#ffb547]/45 mix-blend-multiply"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night/45 to-transparent" aria-hidden />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className={wrap}>
      <div className={`${card} overflow-hidden`}>
        <div className={`skeleton ${coverHeight} rounded-none`} />
        <div className="flex flex-col items-center gap-4 px-8 pb-8">
          <div className="skeleton -mt-16 size-32 rounded-full ring-4 ring-base-100" />
          <div className="skeleton h-7 w-40" />
          <div className="skeleton h-4 w-52" />
          <div className="mt-4 w-full space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
          </div>
          <div className="mt-2 grid w-full grid-cols-2 gap-2">
            <div className="skeleton h-9 rounded-full" />
            <div className="skeleton h-9 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileView() {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;

  if (isPending) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-10 pb-24">
        <div className={`${card} px-8 py-14 text-center`}>
          <h2 className="font-display text-2xl font-bold tracking-tight">We couldn&apos;t load your profile</h2>
          <p className="mt-2 text-base-content/70">Your session may have ended. Log in again to see and edit your details.</p>
          <Link href="/login?redirect=/profile" className="btn-kind mt-6">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  // key resets the card whenever the saved values change
  return <ProfileCard key={`${user.name}|${user.image ?? ""}|${user.coverImage ?? ""}`} user={user} onSaved={refetch} />;
}

interface ProfileUser {
  name: string;
  email: string;
  image?: string | null;
  coverImage?: string | null;
  emailVerified: boolean;
  createdAt: Date;
}

type PhotoTarget = "avatar" | "cover";

function ProfileCard({ user, onSaved }: { user: ProfileUser; onSaved: () => Promise<unknown> }) {
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState("");
  const [target, setTarget] = useState<PhotoTarget>("avatar");
  const [image, setImage] = useState(user.image ?? "");
  const [imageError, setImageError] = useState("");
  const [saving, setSaving] = useState(false);
  const photoDialog = useRef<HTMLDialogElement>(null);

  // one place that talks to better auth for the name, the photo and the cover
  async function save(changes: { name?: string; image?: string | null; coverImage?: string }, done: string) {
    setSaving(true);
    const { error } = await authClient.updateUser(changes);
    setSaving(false);

    if (error) {
      toast.error(error.message || "Could not update your profile");
      return false;
    }

    // next api call should get a fresh jwt with the new name and photo
    clearToken();
    photoDialog.current?.close();
    await onSaved();
    toast.success(done);
    return true;
  }

  async function handleNameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setNameError("Name needs at least 2 characters");
      return;
    }
    if (trimmed === user.name) {
      setEditingName(false);
      return;
    }
    await save({ name: trimmed }, "Name updated");
  }

  function cancelName() {
    setName(user.name);
    setNameError("");
    setEditingName(false);
  }

  const isCover = target === "cover";
  const current = (isCover ? user.coverImage : user.image) ?? "";

  function openPhoto(next: PhotoTarget) {
    setTarget(next);
    setImage((next === "cover" ? user.coverImage : user.image) ?? "");
    setImageError("");
    photoDialog.current?.showModal();
  }

  async function handlePhotoSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const typed = image.trim();
    if (!typed) {
      setImageError("Upload a photo or paste an image link");
      return;
    }
    if (!isUrl(typed)) {
      setImageError("Enter a valid photo URL (http or https)");
      return;
    }
    if (typed === current) {
      photoDialog.current?.close();
      return;
    }
    if (isCover) await save({ coverImage: typed }, "Cover photo updated");
    else await save({ image: typed }, "Profile photo updated");
  }

  // a broken link in the box falls back to the current one in the preview
  const typed = image.trim();
  const previewImage = typed && isUrl(typed) ? typed : current;

  return (
    <div className={wrap}>
      <section className={`${card} overflow-hidden`}>
        <div className="relative">
          <Cover src={user.coverImage} />
          <button
            type="button"
            onClick={() => openPhoto("cover")}
            aria-label="Change cover photo"
            className="absolute top-3 right-3 inline-flex h-9 items-center gap-2 rounded-full bg-black/45 px-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/65"
          >
            <CameraIcon className="size-4" />
            <span>Edit cover</span>
          </button>
        </div>
        <div className="flex flex-col items-center px-6 pb-7 text-center sm:px-8">
          <div className="relative -mt-16 sm:-mt-20">
            <Avatar name={user.name} image={user.image} className="size-32 text-5xl ring-4 ring-base-100 ring-offset-0 sm:size-40" />
            <button
              type="button"
              onClick={() => openPhoto("avatar")}
              aria-label="Change profile photo"
              title="Change profile photo"
              className={`${iconBtn} absolute right-0.5 bottom-0.5 size-10 bg-base-content text-base-100 shadow-lg ring-4 ring-base-100 hover:scale-105`}
            >
              <CameraIcon className="size-[1.1rem]" />
            </button>
          </div>

          {editingName ? (
            <form onSubmit={handleNameSubmit} noValidate className="mt-5 w-full max-w-sm">
              <label htmlFor="name" className="sr-only">
                Your name
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="name"
                  autoComplete="name"
                  autoFocus
                  className={`${authInputClass(nameError)} text-center font-semibold`}
                  value={name}
                  maxLength={60}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "name-error" : undefined}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") cancelName();
                  }}
                />
                <button
                  type="submit"
                  aria-label="Save name"
                  title="Save"
                  disabled={saving}
                  className={`${iconBtn} size-11 bg-base-content text-base-100 hover:opacity-90`}
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                      aria-hidden
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Cancel"
                  title="Cancel"
                  onClick={cancelName}
                  disabled={saving}
                  className={`${iconBtn} size-11 border border-base-300 hover:bg-base-200`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="size-5"
                    aria-hidden
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              {nameError && <FieldError id="name-error">{nameError}</FieldError>}
            </form>
          ) : (
            <div className="mt-5 flex max-w-full items-center gap-1.5 pl-10">
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight break-words">{user.name}</h1>
              <button
                type="button"
                onClick={() => setEditingName(true)}
                aria-label="Edit name"
                title="Edit name"
                className={`${iconBtn} text-base-content/55 hover:bg-base-200 hover:text-base-content`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[1.1rem]"
                  aria-hidden
                >
                  <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
                  <path d="M13.5 6.5l4 4" />
                </svg>
              </button>
            </div>
          )}
          <p className="mt-1 break-all text-base-content/65">{user.email}</p>
        </div>

        <dl className="ticket-notch space-y-3 px-6 py-6 text-sm sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-base-content/60">Member since</dt>
            <dd className="font-semibold">{formatDate(user.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-base-content/60">Email</dt>
            <dd>
              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-semibold text-success">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1 text-xs font-semibold text-base-content/60">
                  <span className="size-1.5 rounded-full bg-base-content/40" aria-hidden />
                  Not verified
                </span>
              )}
            </dd>
          </div>
        </dl>
        <nav className="grid grid-cols-2 gap-2 border-t border-base-300 p-4" aria-label="Your activity">
          <Link href="/joined-events" className="btn-kind-ghost btn-sm">
            Your tickets
          </Link>
          <Link href="/manage-events" className="btn-kind-ghost btn-sm">
            Your events
          </Link>
        </nav>
      </section>

      <dialog ref={photoDialog} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-[1.75rem] border border-base-300 p-7 sm:p-8">
          <h3 className="font-display text-2xl font-bold tracking-tight">{isCover ? "Change cover photo" : "Change profile photo"}</h3>
          <p className="mt-1 text-base-content/65">
            {isCover ? "A wide landscape photo works best." : "Upload a photo or paste a link."} You will see it here before you save.
          </p>

          <form onSubmit={handlePhotoSubmit} noValidate className="mt-6">
            {isCover && <Cover src={previewImage} className="h-28 rounded-2xl" />}
            <div className={`flex items-center gap-4 ${isCover ? "mt-4" : ""}`}>
              {!isCover && <Avatar name={user.name} image={previewImage} className="size-20 text-3xl" />}
              <div>
                <ImageUpload
                  label={isCover ? "Upload cover" : "Upload photo"}
                  onUploaded={(url) => {
                    setImage(url);
                    setImageError("");
                  }}
                />
                <p className="mt-2 text-sm text-base-content/55">JPG, PNG or WebP, up to 2 MB</p>
              </div>
            </div>

            <div className="mt-6">
              <FieldLabel htmlFor="image">Or paste an image link</FieldLabel>
              <input
                id="image"
                type="url"
                placeholder="https://example.com/me.jpg"
                className={authInputClass(imageError)}
                value={image}
                aria-invalid={Boolean(imageError)}
                aria-describedby={imageError ? "image-error" : undefined}
                onChange={(e) => {
                  setImage(e.target.value);
                  if (imageError) setImageError("");
                }}
              />
              {imageError && <FieldError id="image-error">{imageError}</FieldError>}
            </div>

            <div className="modal-action mt-7 flex-col-reverse gap-2 sm:flex-row">
              {isCover && user.coverImage && (
                <button
                  type="button"
                  className="btn btn-ghost w-full rounded-full text-base-content/70 sm:mr-auto sm:w-auto"
                  onClick={() => save({ coverImage: "" }, "Back to the default cover")}
                  disabled={saving}
                >
                  Use default cover
                </button>
              )}
              <button
                type="button"
                className="btn-kind-ghost w-full! sm:w-auto!"
                onClick={() => photoDialog.current?.close()}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn-kind w-full! sm:w-auto!" disabled={saving}>
                {saving && <span className="loading loading-spinner loading-sm" />}
                {saving ? "Saving..." : isCover ? "Save cover" : "Save photo"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </div>
  );
}
