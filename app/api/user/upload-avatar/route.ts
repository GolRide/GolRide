import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function parseForm(req: Request): Promise<{ files: any }> {
  return new Promise(async (resolve, reject) => {
    const form = new IncomingForm({ multiples: false, keepExtensions: true });
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    form.uploadDir = uploadDir;

    const buf = Buffer.from(await req.arrayBuffer());
    const fakeReq: any = Object.assign(new (require("stream").Readable)(), {
      headers: Object.fromEntries(req.headers),
    });
    fakeReq._read = () => {};
    fakeReq.push(buf);
    fakeReq.push(null);

    form.parse(fakeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ files });
    });
  });
}

export async function POST(req: Request) {
  const session = requireSession();
  await dbConnect();

  try {
    const { files } = await parseForm(req);
    const file = files.avatar;
    if (!file) return NextResponse.redirect(new URL("/dashboard/profile?error=no_file", req.url));

    const f = Array.isArray(file) ? file[0] : file;
    const filename = path.basename(f.filepath);
    const publicPath = `/uploads/${filename}`;

    await User.updateOne({ _id: session.userId }, { $set: { avatarUrl: publicPath } });
    return NextResponse.redirect(new URL("/dashboard/profile?saved=1", req.url));
  } catch (e) {
    return NextResponse.redirect(new URL("/dashboard/profile?error=upload", req.url));
  }
}
