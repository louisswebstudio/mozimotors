import Image from "next/image";
import Link from "@/i18n/link";
import { getI18n } from "@/i18n/server";
import { GUIDES } from "./content";
import { Reveal } from "./reveal";
import { BxButton, Container, SECTION_Y, SectionHead } from "./ui";

/** Blog-style guide cards: 3 cols desktop, 2 tablet, 1 mobile. */
export async function Guides() {
  const { t } = await getI18n();
  const items = t.guides.items.map((g, i) => ({ ...g, ...GUIDES[i] }));
  return (
    <section className={SECTION_Y}>
      <Container className="flex flex-col gap-10">
        <SectionHead
          eyebrow={t.guides.eyebrow}
          title={t.guides.title}
          right={
            <BxButton href="/pourquoi-mozimotors" variant="link">
              {t.guides.link}
            </BxButton>
          }
        />
        <Reveal y={24} className="grid grid-cols-1 gap-[30px] bxt:grid-cols-2 bxt:gap-5 bxd:grid-cols-3">
          {items.map((g) => (
            <Link key={g.href + g.title} href={g.href} className="group flex flex-col gap-5">
              <div className="relative h-[206px] overflow-hidden rounded-2xl bxt:h-[280px]">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  sizes="(min-width:1200px) 419px, (min-width:810px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 bx-ease group-hover:scale-105"
                />
                <div className="absolute start-[11px] top-2.5 z-[1] flex items-center gap-1 rounded-[120px] bg-white px-2.5 py-[5px]">
                  <span className="size-1 rounded-full bg-bx-navy" />
                  <span className="text-xs font-medium uppercase leading-5 text-bx-navy">{g.tag}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 pe-0 bxt:pe-[60px]">
                <div className="flex items-center gap-2.5 text-sm leading-5 text-bx-ink">
                  <span>{t.guides.author}</span>
                  <span className="size-[3px] rounded-full bg-bx-navy" />
                  <span>{t.guides.meta}</span>
                </div>
                <h5 className="text-[18px] font-medium leading-[23px] text-bx-navy transition-colors duration-300 bx-ease group-hover:text-bx-blue bxt:text-[20px] bxt:leading-[26px]">
                  {g.title}
                </h5>
              </div>
            </Link>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
