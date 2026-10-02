import { monthlyPayment } from "@/lib/format";
import type { Car } from "@/lib/types";
import type { I18n } from "@/i18n/core";
import type { VehicleCardData } from "../root-8a5edab2/content";

/** Car → props for the Boxcars `VehicleCard`, with labels and prices in the current language. */
export function toVehicleCard(car: Car, rate: number, months: number, { t, price, num, fmt }: I18n): VehicleCardData {
  return {
    href: `/voiture/${car.slug}`,
    image: car.images[0],
    tag: car.certified ? t.common.certified : t.common.used,
    title: `${car.brand} ${car.model}`,
    subtitle: `${car.year} • ${car.version}`,
    mileage: fmt(t.common.km, { n: num(car.mileage) }),
    fuel: t.vehicle.fuel[car.fuel],
    gearbox: t.vehicle.gearbox[car.gearbox],
    gearboxShort: t.vehicle.gearboxShort[car.gearbox],
    price: price(car.price),
    monthly: price(monthlyPayment(car.price, rate, months)),
  };
}
