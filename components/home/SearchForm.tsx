"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export function SearchForm() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [team, setTeam] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (origin.trim()) params.set("origin", origin.trim());
    if (destination.trim()) params.set("destination", destination.trim());
    if (date.trim()) params.set("date", date.trim());
    if (team.trim()) params.set("team", team.trim());

    // ✅ En vez de pintar resultados en home, llevamos a la página con protagonismo
    router.push(`/trips?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-700">Origen</label>
          <Input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Ej: Jerez"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Destino</label>
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ej: Sevilla"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-700">Fecha</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Equipo</label>
          <Input
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Ej: Xerez CD"
          />
        </div>
      </div>

      <Button type="submit" className="mt-2">
        Buscar viajes
      </Button>
    </form>
  );
}

