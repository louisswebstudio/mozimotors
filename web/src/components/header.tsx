"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./logo";

const NAV = [
  { href: "/acheter", label: "Acheter" },
  { href: "/vendre", label: "Vendre" },
  { href: "/financement", label: "Financement" },
  { href: "/pourquoi-mozimotors", label: "Pourquoi nous" },
  { href: "/contact", label: "Contact" },
];

export function Header({ phone }: { phone: string }) {
  const pathname = usePathname();
  // Menu is tied to the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "bg-white/85 backdrop-blur-xl border-b border-line" : "bg-cream border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center gap-6 lg:h-[72px]">
        <Logo />
        <nav className="hidden lg:flex items-center gap-0.5 ml-2">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-semibold transition ${
                  active ? "bg-ink text-white" : "text-ink-2 hover:bg-sand"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="hidden xl:flex whitespace-nowrap items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-2 hover:bg-sand"
          >
            <Phone className="size-4 text-brand" /> {phone}
          </a>
          <Link
            href="/vendre"
            className="hidden sm:inline-flex whitespace-nowrap rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_var(--color-brand)] transition hover:bg-brand-600"
          >
            Estimer ma voiture
          </Link>
          <button
            onClick={() => setOpenOn(open ? null : pathname)}
            className="lg:hidden grid size-10 place-items-center rounded-full hover:bg-sand"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-white">
          <nav className="container-x flex flex-col py-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-sand">
                {n.label}
              </Link>
            ))}
            <Link href="/vendre" className="mt-2 rounded-full bg-brand px-5 py-3 text-center font-bold text-white">
              Estimer ma voiture
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
