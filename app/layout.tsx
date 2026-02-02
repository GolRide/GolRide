import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { getSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "GolRide",
  description: "Publica y reserva viajes para ir a ver a tu equipo",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar isAuthed={!!session} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

