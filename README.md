# GolRide — web tipo BlaBlaCar para afición

Stack:
- Next.js (App Router) + Tailwind
- MongoDB (Mongoose)
- Auth con JWT (cookie httpOnly)
- Emails con Nodemailer (código de verificación + confirmaciones)
- Stripe Checkout + webhook para confirmar pagos
- Publicación de viajes + reservas

> Importante: NO metas contraseñas directamente en el código. Usa `.env.local`.

## 1) Instalación
```bash
npm install
```

## 2) Variables de entorno
Copia `.env.example` a `.env.local` y rellénalo:
```bash
cp .env.example .env.local
```

Necesitas:
- `MONGODB_URI`
- `JWT_SECRET`
- SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, etc.)
- Stripe (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`)

## 3) Ejecutar en local
```bash
npm run dev
```
Abre http://localhost:3000

## 4) Stripe webhook (local)
La ruta de webhook es:
- `POST /api/stripe/webhook`

En local puedes usar Stripe CLI:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copia el `whsec_...` a `STRIPE_WEBHOOK_SECRET`.

## 5) Carpetas clave
- `app/` páginas y rutas API (route handlers)
- `lib/` auth, db, email, stripe utils
- `models/` esquemas MongoDB
- `public/` logo e ilustraciones
