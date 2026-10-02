import Link from "@/i18n/link";
import { getI18n } from "@/i18n/server";
import type { BrandCardData } from "./content";
import { Reveal } from "./reveal";
import { BxButton, Container, SectionHead } from "./ui";

function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function BrandCard({ brand }: { brand: BrandCardData }) {
  const mask = brand.logo ? `url(${brand.logo}) center / contain no-repeat` : undefined;
  return (
    <Link
      href={brand.href}
      className="group flex h-[172px] min-w-0 flex-col items-center justify-center rounded-2xl border border-bx-line bg-white px-5 py-[30px] transition-all duration-300 bx-ease hover:-translate-y-1.5 hover:border-bx-blue hover:shadow-[0_16px_32px_-16px_rgba(64,95,242,0.35)] bxt:h-[186px] bxd:flex-1 bxd:px-10"
    >
      <span className="grid size-20 shrink-0 place-items-center bxt:size-[100px]">
        {mask ? (
          <span
            aria-hidden
            className="block size-[46px] bg-bx-navy transition-colors duration-300 bx-ease group-hover:bg-bx-blue bxt:size-14"
            style={{ WebkitMask: mask, mask }}
          />
        ) : (
          <span
            aria-hidden
            className="text-[28px] font-bold leading-none text-bx-navy transition-colors duration-300 bx-ease group-hover:text-bx-blue"
          >
            {initials(brand.name)}
          </span>
        )}
      </span>
      <span className="whitespace-nowrap text-center text-base font-medium leading-[26px] text-bx-ink transition-colors duration-300 bx-ease group-hover:text-bx-blue">
        {brand.name}
      </span>
    </Link>
  );
}

export async function BrandsSection({ brands }: { brands: BrandCardData[] }) {
  const { t } = await getI18n();
  const list = brands.slice(0, 8);
  return (
    <section className="bg-bx-soft pb-[30px] pt-[30px] bxt:py-[60px] bxd:pb-[90px] bxd:pt-[30px]">
      <Container className="flex flex-col gap-[30px] bxt:gap-10">
        <SectionHead
          eyebrow={t.brands.eyebrow}
          title={t.brands.title}
          right={
            <BxButton variant="link" href="/acheter">
              {t.brands.link}
            </BxButton>
          }
        />
        <Reveal y={24}>
          <div className="grid grid-cols-2 gap-5 bxt:grid-cols-4 bxd:flex bxd:flex-row">
            {list.map((brand) => (
              <BrandCard key={brand.name} brand={brand} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default BrandsSection;
