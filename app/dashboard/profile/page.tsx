import jwt from "jsonwebtoken"
import { requireSession } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import ProfileClient from "@/components/dashboard/ProfileClient"

export default async function ProfilePage() {
  const session = await requireSession()
  const token = (session as any).token as string

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
  const userId = decoded.userId as string

  await connectDB()
  const user = await User.findById(userId).lean()
  if (!user) throw new Error("Usuario no encontrado")

  const initialUser = {
    email: (user as any).email ?? "",
    username: (user as any).username ?? "",
    name: (user as any).name ?? "",
    surname: (user as any).surname ?? "",
    phone: (user as any).phone ?? "",
    team: (user as any).team ?? "",
    avatar: (user as any).avatar ?? "",
  }

  return <ProfileClient initialUser={initialUser} />
}

