"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Catalog } from "@/lib/wp";

const selectCls =
  "w-full appearance-none bg-transparent py-1 text-[15px] font-semibold text-ink outline-none disabled:text-muted/60 cursor-pointer";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col rounded-2xl px-4 py-2.5 transition hover:bg-sand focus-within:bg-sand">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

export function SearchBar({ catalog, cities }: { catalog: Catalog; cities: string[] }) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");

  const models = useMemo(() => catalog.find((b) => b.slug === brand)?.models ?? [], [catalog, brand]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (brand) p.set("brand", brand);
    if (model) p.set("model", model);
    if (city) p.set("city", city);
    if (budget) p.set("maxPrice", budget);
    router.push(`/acheter${p.size ? `?${p}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-1 rounded-3xl bg-white p-2 shadow-lift ring-1 ring-line sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
    >
      <Field label="Marque">
        <select className={selectCls} value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); }}>
          <option value="">Toutes les marques</option>
          {catalog.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name} ({b.count})</option>
          ))}
        </select>
      </Field>
      <Field label="Modèle">
        <select className={selectCls} value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand}>
          <option value="">{brand ? "Tous les modèles" : "Choisir une marque"}</option>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Ville">
        <select className={selectCls} value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Tout le Maroc</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Budget max">
        <select className={selectCls} value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Pas de limite</option>
          {[100000, 150000, 200000, 250000, 300000, 400000, 500000].map((v) => (
            <option key={v} value={v}>{new Intl.NumberFormat("fr-FR").format(v)} DH</option>
          ))}
        </select>
      </Field>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 font-bold text-white transition hover:bg-brand-600 sm:col-span-2 lg:col-span-1"
      >
        <Search className="size-5" /> Rechercher
      </button>
    </form>
  );
}
