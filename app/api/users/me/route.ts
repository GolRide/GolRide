import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { cookies } from "next/headers"

function getUserIdFromToken() {
  const token = cookies().get("token")?.value
  if (!token) return null
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  return decoded.userId as string
}

export async function GET() {
  await connectDB()
  const userId = getUserIdFromToken()
  if (!userId) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 })

  const user = await User.findById(userId).lean()
  if (!user) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  return NextResponse.json({
    user: {
      _id: (user as any)._id?.toString?.() ?? null,
      email: (user as any).email ?? "",
      username: (user as any).username ?? "",
      name: (user as any).name ?? "",
      surname: (user as any).surname ?? "",
      phone: (user as any).phone ?? "",
      team: (user as any).team ?? "",
      avatar: (user as any).avatar ?? "", // base64/dataURL o url
    },
  })
}

export async function PATCH(req: Request) {
  await connectDB()
  const userId = getUserIdFromToken()
  if (!userId) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 })

  const body = await req.json()

  // Campos permitidos (minimal)
  const update: any = {}
  for (const key of ["username", "name", "surname", "phone", "team", "avatar"]) {
    if (typeof body[key] === "string") update[key] = body[key]
  }

  const user = await User.findByIdAndUpdate(userId, update, { new: true }).lean()
  if (!user) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  return NextResponse.json({
    ok: true,
    user: {
      email: (user as any).email ?? "",
      username: (user as any).username ?? "",
      name: (user as any).name ?? "",
      surname: (user as any).surname ?? "",
      phone: (user as any).phone ?? "",
      team: (user as any).team ?? "",
      avatar: (user as any).avatar ?? "",
    },
  })
}

