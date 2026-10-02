import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Fuel, Gauge, MapPin, Settings2 } from "lucide-react";
import type { Car } from "@/lib/types";
import { FUEL_LABELS, formatKm, formatNumber, formatPrice, monthlyPayment } from "@/lib/format";

export function CarCard({ car, rate = 6.9, months = 60, priority = false }: { car: Car; rate?: number; months?: number; priority?: boolean }) {
  const monthly = monthlyPayment(car.price, rate, months);
  return (
    <Link
      href={`/voiture/${car.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-line/70 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {car.images[0] && (
          <Image
            src={car.images[0]}
            alt={`${car.brand} ${car.model} ${car.year}`}
            fill
            priority={priority}
            sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 90vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {car.certified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ok backdrop-blur">
              <BadgeCheck className="size-3.5" /> Certifiée
            </span>
          )}
          {car.financeable && (
            <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">Finançable</span>
          )}
        </div>
        {car.oldPrice && car.oldPrice > car.price && (
          <span className="absolute right-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white">
            −{formatNumber(car.oldPrice - car.price)} DH
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-[17px] font-bold leading-tight text-ink">
              {car.brand} {car.model} <span className="font-medium text-muted">{car.year}</span>
            </h3>
            <p className="mt-0.5 truncate text-sm text-muted">{car.version}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[13px] text-ink-2">
          <span className="inline-flex items-center gap-1"><Gauge className="size-3.5 text-muted" />{formatKm(car.mileage)}</span>
          <span className="inline-flex items-center gap-1"><Settings2 className="size-3.5 text-muted" />{car.gearbox === "automatique" ? "Auto" : "Manuelle"}</span>
          <span className="inline-flex items-center gap-1"><Fuel className="size-3.5 text-muted" />{FUEL_LABELS[car.fuel]}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-dashed border-line pt-3 mt-4">
          <div>
            <p className="font-display text-xl font-extrabold text-ink">{formatPrice(car.price)}</p>
            {car.financeable && (
              <p className="text-xs text-muted">
                ou <span className="font-bold text-brand">{formatNumber(monthly)} DH</span>/mois
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <MapPin className="size-3.5" />
            {car.city}
          </span>
        </div>
      </div>
    </Link>
  );
}
