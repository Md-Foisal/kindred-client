import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024;

// check the first bytes, the type a browser sends can be faked
function imageExtension(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return "webp";
  return null;
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Choose an image to upload" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "Image must be 2 MB or smaller" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = imageExtension(bytes);
  if (!extension) {
    return NextResponse.json({ message: "Use a JPG, PNG or WebP image" }, { status: 400 });
  }

  const blob = await put(`uploads/image.${extension}`, Buffer.from(bytes), {
    access: "public",
    addRandomSuffix: true,
    contentType: extension === "jpg" ? "image/jpeg" : `image/${extension}`,
  });
  return NextResponse.json({ url: blob.url });
}
