"use client";

import { useMemo, useState } from "react"

type UserDTO = {
  email: string
  username: string
  name: string
  surname: string
  phone: string
  team: string
  avatar: string
}

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.8 9.95l-3.75-3.75L3 17.25zm2.92 2.83H5v-.92l9.06-9.06.92.92L5.92 20.08zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      />
    </svg>
  )
}

function IconEye({ open }: { open: boolean }) {
  return open ? (
    <span aria-hidden="true">👁️</span>
  ) : (
    <span aria-hidden="true">🙈</span>
  );
}

function Row({
  label,
  value,
  editable,
  editing,
  onEdit,
  onChange,
  disabled,
}: {
  label: string
  value: string
  editable?: boolean
  editing?: boolean
  onEdit?: () => void
  onChange?: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <div className="text-xs font-extrabold tracking-wide text-slate-500">{label}</div>
        {!editing ? (
          <div className="text-sm font-semibold text-slate-900 truncate">{value || "—"}</div>
        ) : (
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
          />
        )}
      </div>

      {editable && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
          title={editing ? "Editar" : "Editar"}
        >
          <IconPencil />
        </button>
      )}
    </div>
  )
}

export default function ProfileClient({ initialUser }: { initialUser: UserDTO }) {
  const [user, setUser] = useState<UserDTO>(initialUser)
  const [editing, setEditing] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string>("")

  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")

  const avatarPreview = useMemo(() => user.avatar || "", [user.avatar])

  function toggleEdit(key: keyof UserDTO) {
    setEditing((prev) => ({ ...prev, [key]: !prev[key] }))
    setMsg("")
  }

  async function onAvatarFile(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || "")
      setUser((u) => ({ ...u, avatar: result }))
      setMsg("")
    }
    reader.readAsDataURL(file)
  }

  async function save() {
    setSaving(true)
    setMsg("")
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          name: user.name,
          surname: user.surname,
          phone: user.phone,
          team: user.team,
          avatar: user.avatar,
          // password lo dejamos para un siguiente paso (requiere hash/bcrypt)
        }),
      })

      if (!res.ok) {
        setMsg("No se pudo guardar. Revisa e inténtalo.")
        return
      }

      const data = await res.json()
      setUser((u) => ({ ...u, ...data.user }))
      setEditing({})
      setMsg("Cambios guardados ✅")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Perfil</h1>
          <p className="mt-1 text-sm text-slate-600">Edita tus datos con el mismo estilo de registro.</p>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {msg && <div className="mt-4 text-sm text-zinc-700">{msg}</div>}

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-extrabold text-slate-900">Foto de perfil</div>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-slate-500">
                  Sin foto
                </div>
              )}
            </div>

            <label className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-50 cursor-pointer">
              Subir foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onAvatarFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        <Row
          label="Email"
          value={user.email}
          editable={false}
        />

        <Row
          label="Nombre de usuario"
          value={user.username}
          editable
          editing={!!editing.username}
          onEdit={() => toggleEdit("username")}
          onChange={(v) => setUser((u) => ({ ...u, username: v }))}
        />

        <Row
          label="Equipo (opcional)"
          value={user.team}
          editable
          editing={!!editing.team}
          onEdit={() => toggleEdit("team")}
          onChange={(v) => setUser((u) => ({ ...u, team: v }))}
        />

        <Row
          label="Nombre"
          value={user.name}
          editable
          editing={!!editing.name}
          onEdit={() => toggleEdit("name")}
          onChange={(v) => setUser((u) => ({ ...u, name: v }))}
        />

        <Row
          label="Apellidos"
          value={user.surname}
          editable
          editing={!!editing.surname}
          onEdit={() => toggleEdit("surname")}
          onChange={(v) => setUser((u) => ({ ...u, surname: v }))}
        />

        <Row
          label="Teléfono"
          value={user.phone}
          editable
          editing={!!editing.phone}
          onEdit={() => toggleEdit("phone")}
          onChange={(v) => setUser((u) => ({ ...u, phone: v }))}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-extrabold tracking-wide text-slate-500">Contraseña</div>
          <div className="mt-2 flex items-center gap-2">
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Cambiar contraseña (lo activamos después)"
            />
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50"
              onClick={() => setShowPassword((s) => !s)}
              title={showPassword ? "Ocultar" : "Mostrar"}
            >
              <IconEye open={showPassword} />
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Nota: el cambio real de contraseña lo conectamos en el siguiente paso (bcrypt).
          </div>
        </div>
      </div>
    </div>
  )
}
