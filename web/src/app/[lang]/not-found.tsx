/** 404 inside the site layout (copy from the main dictionary of the current language). */
import { getV2 } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/server-locale";
import { HOME } from "@/components/sites/siaracash-ma-449ca86b/root-8a5edab2/assets";

export default async function NotFound() {
  const { dict: t, href } = await getV2();
  return (
    <section className="flex flex-col items-center bg-white px-4 pb-28 pt-24 text-center">
      <p className="text-5xl font-bold leading-none text-[color:var(--color-brand-purple)] lg:text-6xl">404</p>
      <h1 className="mt-5 text-[24px] font-bold text-[color:var(--color-brand-dark)] lg:text-[32px]">{t.notFound.title}</h1>
      <p className="mt-2.5 text-[15px] leading-6 text-[color:var(--color-ink-muted)]">{t.notFound.text}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a
          className="inline-flex h-12 items-center justify-center rounded-[30px] bg-[color:var(--color-brand-teal)] px-6 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[color:var(--color-brand-teal-hover)]"
          href={href("/acheter")}
        >
          {t.common.seeCars}
        </a>
        <a className="text-[14px] font-semibold text-[color:var(--color-brand-teal-text)] hover:underline" href={href(HOME)}>
          {t.nav.home}
        </a>
      </div>
    </section>
  );
}
