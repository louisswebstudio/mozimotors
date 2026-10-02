"use client";

import Image from "next/image";
import Link from "@/i18n/link";
import { useI18n } from "@/i18n/client";
import { stripLocale } from "@/i18n/config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, Phone, Search } from "lucide-react";
import type { BuyMenu } from "@/lib/buy-menu";
import { BxButton } from "./ui";
import { LOGO } from "./content";

/** Main nav targets; labels come from t.nav[key]. */
const NAV = [
  { key: "home", href: "/" },
  { key: "buy", href: "/acheter" },
  { key: "sell", href: "/vendre" },
  { key: "why", href: "/pourquoi-mozimotors" },
  { key: "contact", href: "/contact" },
] as const;
import { LanguagePicker } from "./LanguagePicker";
import { BuyMegaPanel, BuyMobilePanel, hasBuyLinks } from "./BuyMegaMenu";

const LOGO_H = 34;
const LOGO_W = Math.round(LOGO_H * LOGO.ratio); // ≈118

/** Extra route prefixes that keep a nav item highlighted (detail pages live outside the nav). */
const ALSO_ACTIVE: Record<string, string[]> = {
  "/acheter": ["/voiture"],
};

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  const prefixes = [href, ...(ALSO_ACTIVE[href] ?? [])];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Focus ring shared by every interactive element on the navy bar. */
const RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bx-navy";

/** Two-bar hamburger that morphs into an X. */
function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
      aria-expanded={open}
      aria-controls="bx-mobile-menu"
      className={`relative size-[25px] shrink-0 cursor-pointer rounded bxd:hidden ${RING}`}
    >
      <span
        className={`absolute h-[2px] bg-white transition-all duration-300 bx-ease ${
          open ? "top-[11.5px] w-[19px] -rotate-45 end-[3px]" : "end-0 top-[6px] w-[25px]"
        }`}
      />
      <span
        className={`absolute h-[2px] bg-white transition-all duration-300 bx-ease ${
          open ? "top-[11.5px] w-[19px] rotate-45 end-[3px]" : "end-0 top-[16px] w-[20px]"
        }`}
      />
    </button>
  );
}

/**
 * Stock search. Submits to /acheter?q=… — a real GET form, so it still works
 * without JS; with JS it navigates client-side.
 */
function NavSearch({ variant, onDone }: { variant: "bar" | "panel"; onDone?: () => void }) {
  const router = useRouter();
  const { t, href } = useI18n();
  const [q, setQ] = useState("");
  const panel = variant === "panel";
  // Bar variant is icon-only until clicked; the panel variant is always open.
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shown = panel || expanded;
  return (
    <form
      action={href("/acheter")}
      method="get"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(href(term ? `/acheter?q=${encodeURIComponent(term)}` : "/acheter"));
        onDone?.();
        if (!panel) setExpanded(false);
      }}
      onBlur={(e) => {
        if (!panel && !q.trim() && !e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false);
      }}
      onKeyDown={(e) => {
        if (!panel && e.key === "Escape") setExpanded(false);
      }}
      className={`flex min-w-0 items-center rounded-xl border text-white transition-[width,background-color,border-color] duration-300 bx-ease ${
        panel
          ? "w-full gap-[7px] border-white/15 bg-white/5 px-[18px] py-[13px] hover:border-white/25 focus-within:border-white/35 focus-within:bg-white/10"
          : expanded
            ? "w-[180px] gap-[6px] border-white/25 bg-white/10 px-2.5 py-[3px]"
            : "w-[36px] justify-center border-transparent bg-transparent py-[5px] hover:bg-white/10"
      }`}
    >
      <label htmlFor={`bx-q-${variant}`} className="sr-only">
        {t.nav.searchLabel}
      </label>
      {panel ? (
        <Search size={18} strokeWidth={1.5} className="shrink-0 text-white/70" aria-hidden />
      ) : (
        <button
          type="button"
          aria-label={t.nav.searchLabel}
          aria-expanded={expanded}
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            } else if (q.trim()) inputRef.current?.form?.requestSubmit();
            else setExpanded(false);
          }}
          className={`grid size-6 shrink-0 place-items-center rounded text-white ${RING}`}
        >
          <Search size={18} strokeWidth={1.5} aria-hidden />
        </button>
      )}
      <input
        ref={inputRef}
        tabIndex={shown ? 0 : -1}
        id={`bx-q-${variant}`}
        name="q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.nav.searchPlaceholder}
        autoComplete="off"
        className={`min-w-0 bg-transparent font-medium text-white outline-none placeholder:text-white/50 [&::-webkit-search-cancel-button]:hidden ${
          panel ? "flex-1 text-[17px] leading-[22.1px]" : "text-[14px] leading-5"
        } ${shown ? "flex-1" : "w-0 p-0"}`}
      />
    </form>
  );
}

/**
 * Desktop "Acheter" dropdown (built from the stock in src/lib/buy-menu.ts). Opens on hover with a
 * short close delay, or from the chevron button for keyboard/touch; Esc, click-outside, leaving
 * focus or navigating closes it. "Acheter" itself stays a normal link to the full list.
 */
function BuyDropdown({
  menu,
  label,
  href,
  active,
  pathname,
}: {
  menu: BuyMenu;
  label: string;
  href: string;
  active: boolean;
  pathname: string;
}) {
  const { t, fmt } = useI18n();
  // `by` = why it's open. Hover opens it softly; a click pins it, so the click that follows the
  // hover (mouse, or tap on touch screens) doesn't toggle it straight back closed.
  const [state, setState] = useState<{ on: string; by: "hover" | "click" } | null>(null);
  const open = state?.on === pathname;
  const setOpenOn = (on: string | null, by: "hover" | "click" = "hover") => setState(on ? { on, by } : null);
  const rootRef = useRef<HTMLLIElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => {
    clearTimeout(timer.current);
    if (!open) setOpenOn(pathname, "hover");
  };
  const hideSoon = () => {
    clearTimeout(timer.current);
    if (state?.by === "click") return;
    timer.current = setTimeout(() => setOpenOn(null), 150);
  };
  const toggle = () => {
    clearTimeout(timer.current);
    setOpenOn(open && state?.by === "click" ? null : pathname, "click");
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenOn(null);
      btnRef.current?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <li
      ref={rootRef}
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(e) => !rootRef.current?.contains(e.relatedTarget as Node) && setOpenOn(null)}
    >
      <div className="flex items-center gap-1">
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={`group/nl relative block whitespace-nowrap rounded text-[15px] font-medium leading-6 transition-colors duration-300 bx-ease ${RING} ${
            active || open ? "text-white" : "text-white/75 hover:text-white"
          }`}
        >
          {label}
          <span
            className={`absolute start-0 top-[23px] h-px bg-white transition-all duration-300 bx-ease ${
              active ? "w-full opacity-100" : "w-0 opacity-0 group-hover/nl:w-full group-hover/nl:opacity-100"
            }`}
          />
        </Link>
        <button
          ref={btnRef}
          type="button"
          aria-expanded={open}
          aria-controls="bx-buy-menu"
          aria-label={fmt(open ? t.nav.hideShortcuts : t.nav.showShortcuts, { label })}
          onClick={toggle}
          className={`grid size-5 place-items-center rounded text-white/75 transition-colors duration-300 hover:text-white ${RING}`}
        >
          <ChevronDown
            size={15}
            strokeWidth={2}
            aria-hidden
            className={`transition-transform duration-300 bx-ease ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Anchored to the centred link list (bxd:absolute → its containing block), which is itself centred in the bar,
          so the panel centres under the bar. Width uses viewport units because % would resolve against that narrow list.
          pt bridges the gap so the pointer can travel into the panel without closing it. */}
      <div
        id="bx-buy-menu"
        inert={!open}
        className={`absolute left-1/2 top-full z-50 w-[min(1060px,calc(100vw-80px))] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-200 bx-ease ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <BuyMegaPanel menu={menu} href={href} onNavigate={() => setOpenOn(null)} />
      </div>
    </li>
  );
}

/** Mobile/tablet panel: "Acheter" row with an expander revealing the same shortcuts as chips. */
function MobileBuy({
  menu,
  label,
  href,
  active,
  onNavigate,
}: {
  menu: BuyMenu;
  label: string;
  href: string;
  active: boolean;
  onNavigate: () => void;
}) {
  const { t, fmt } = useI18n();
  const [expanded, setExpanded] = useState(false);
  return (
    <li>
      <div className={`flex items-center rounded-2xl transition-colors duration-300 ${active ? "bg-white/10" : ""}`}>
        <Link
          href={href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`block flex-1 rounded-2xl px-[18px] py-[14px] text-[17px] font-medium leading-[22.1px] transition-colors duration-300 ${RING} ${
            active ? "text-white" : "text-white/80 hover:text-white"
          }`}
        >
          {label}
        </Link>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="bx-buy-mobile"
          aria-label={fmt(expanded ? t.nav.hideShortcuts : t.nav.showShortcuts, { label })}
          onClick={() => setExpanded((v) => !v)}
          className={`me-2 grid size-10 place-items-center rounded-xl text-white/80 transition-colors duration-300 hover:bg-white/5 hover:text-white ${RING}`}
        >
          <ChevronDown
            size={18}
            strokeWidth={2}
            aria-hidden
            className={`transition-transform duration-300 bx-ease ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 bx-ease ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div id="bx-buy-mobile" className="min-h-0 overflow-hidden" inert={!expanded}>
          <BuyMobilePanel menu={menu} href={href} onNavigate={onNavigate} />
        </div>
      </div>
    </li>
  );
}

export function Navbar({ phone, email, buyMenu }: { phone: string; email: string; buyMenu?: BuyMenu }) {
  const { t } = useI18n();
  // Active-link matching works on the unprefixed path ("/en/acheter" → "/acheter").
  const pathname = stripLocale(usePathname());
  // The menu is tied to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);
  const tel = `tel:${phone.replace(/\s+/g, "")}`;

  // Close when resizing up to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1200px)");
    const onChange = () => mq.matches && setOpenOn(null);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Escape closes the open panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Fixed bar: compacts and turns solid once the page is scrolled.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);
  // Homepage: transparent over the hero until scrolled. Inner pages: solid navy bar ("Dark" variant).
  const overlay = pathname === "/";
  const solid = !overlay || scrolled || open;

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 font-bx transition-[background-color,box-shadow] duration-300 bx-ease ${
        solid ? "bg-bx-navy/95 backdrop-blur-md" : "bg-transparent"
      } ${scrolled && !open ? "shadow-[0_8px_24px_rgba(5,11,32,0.18)]" : ""} ${open ? "max-h-[100dvh] overflow-y-auto bg-bx-navy" : ""}`}
      aria-label={t.nav.label}
      data-lenis-prevent={open ? "" : undefined}
    >
      <div
        className={`relative mx-auto flex w-full max-w-[1356px] flex-col px-[30px] transition-[padding] duration-300 bx-ease ${
          scrolled && !open ? "py-4" : "py-[30px]"
        }`}
      >
        {/* Top row */}
        <div className="relative flex h-[26px] items-center justify-between gap-[30px] bxt:h-11">
          {/* Left: logo + search */}
          <div className="flex min-w-0 items-center gap-5 bxd:flex-1">
            <Link
              href="/"
              aria-label={t.nav.homeAria}
              className={`flex shrink-0 items-center rounded ${RING}`}
              onClick={close}
            >
              <Image
                src={LOGO.white}
                alt="MoziMotors"
                width={LOGO_W}
                height={LOGO_H}
                preload
                className="block h-[34px]"
                style={{ width: LOGO_W }}
              />
            </Link>
            {/* Tablet & desktop: real search field. Mobile: icon shortcut to the stock page. */}
            <Link
              href="/acheter"
              onClick={close}
              aria-label={t.nav.searchLabel}
              className={`grid size-[25px] shrink-0 place-items-center rounded text-white bxt:hidden ${RING}`}
            >
              <Search size={18} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>

          {/* Center: links (desktop) */}
          <ul className="hidden items-center justify-center gap-4 min-[1280px]:gap-7 min-[1320px]:gap-9 bxd:absolute bxd:start-1/2 bxd:flex bxd:-translate-x-1/2 rtl:bxd:translate-x-1/2">
            {NAV.map(({ key, href: linkHref }) => {
              const l = { href: linkHref, label: t.nav[key] };
              const active = isActive(l.href, pathname);
              if (l.href === "/acheter" && buyMenu && hasBuyLinks(buyMenu))
                return (
                  <BuyDropdown key={l.href} menu={buyMenu} label={l.label} href={l.href} active={active} pathname={pathname} />
                );
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`group/nl relative block whitespace-nowrap rounded text-[15px] font-medium leading-6 transition-colors duration-300 bx-ease ${RING} ${
                      active ? "text-white" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {l.label}
                    <span
                      className={`absolute start-0 top-[23px] h-px bg-white transition-all duration-300 bx-ease ${
                        active
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover/nl:w-full group-hover/nl:opacity-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right */}
          <div className="flex items-center justify-end gap-4 bxd:flex-1">
            <span className="hidden bxt:flex">
              <NavSearch variant="bar" />
            </span>
            <LanguagePicker />
            <Burger open={open} onClick={() => setOpen(!open)} />
            <span className="hidden bxt:contents">
              <BxButton href="/vendre" variant="white-border">
                {t.common.estimateMyCar}
              </BxButton>
            </span>
          </div>
        </div>

        {/* Open panel (tablet & mobile) — animates open, stays out of the tab order when closed. */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 bx-ease bxd:hidden ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div id="bx-mobile-menu" className="min-h-0 overflow-hidden" inert={!open}>
            <div className="flex flex-col gap-[30px] pt-[30px]">
              <span className="bxt:hidden">
                <NavSearch variant="panel" onDone={close} />
              </span>
              <ul className="flex flex-col gap-2.5">
                {NAV.map(({ key, href: linkHref }) => {
              const l = { href: linkHref, label: t.nav[key] };
                  const active = isActive(l.href, pathname);
                  if (l.href === "/acheter" && buyMenu && hasBuyLinks(buyMenu))
                    return (
                      <MobileBuy key={l.href} menu={buyMenu} label={l.label} href={l.href} active={active} onNavigate={close} />
                    );
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={`block w-full rounded-2xl px-[18px] py-[14px] text-[17px] font-medium leading-[22.1px] transition-colors duration-300 ${RING} ${
                          active ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div onClick={close} className="bxt:hidden">
                <BxButton href="/vendre" variant="primary" className="w-full">
                  {t.common.estimateMyCar}
                </BxButton>
              </div>
              <div className="flex flex-col gap-5 border-t border-white/10 pt-[30px]">
                <p className="text-[21px] font-medium leading-[27.3px] text-white">{t.nav.contactTitle}</p>
                <div className="flex flex-wrap gap-5">
                  <a
                    href={tel}
                    className={`flex items-center gap-2.5 rounded text-sm leading-5 text-bx-muted transition-colors duration-300 hover:text-white ${RING}`}
                  >
                    <span className="grid size-[42px] shrink-0 place-items-center rounded-2xl bg-white/5 text-white">
                      <Phone size={16} strokeWidth={1.5} aria-hidden />
                    </span>
                    {phone}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className={`flex items-center gap-2.5 rounded text-sm leading-5 text-bx-muted transition-colors duration-300 hover:text-white ${RING}`}
                  >
                    <span className="grid size-[42px] shrink-0 place-items-center rounded-2xl bg-white/5 text-white">
                      <Mail size={16} strokeWidth={1.5} aria-hidden />
                    </span>
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
