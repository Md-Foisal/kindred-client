"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ onUploaded, label = "Upload photo" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // clear it so picking the same file again still fires change
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) throw new Error(data?.message || "Upload failed, please try again");
      onUploaded(data.url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed, please try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label={label}
        onChange={handleChange}
      />
      <button
        type="button"
        className="btn btn-sm btn-outline mt-2 rounded-full"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading && <span className="loading loading-spinner loading-xs" />}
        {uploading ? "Uploading..." : label}
      </button>
    </>
  );
}
