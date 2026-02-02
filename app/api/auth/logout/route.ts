import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  cookies().set("token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
  });

  return NextResponse.redirect(new URL("/", req.url));
}
