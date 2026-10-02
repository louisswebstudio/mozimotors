import type { StatData } from "./content";
import { CountUp } from "./CountUp";
import { Reveal } from "./reveal";
import { Container } from "./ui";

function Star() {
  return (
    <svg viewBox="0 0 20 19.97" className="h-5 w-5 shrink-0" fill="#405FF2" aria-hidden>
      <path d="M4.645 12.77 3.589 19.242c-.084.514.465.9.919.648L10 16.855l5.492 3.036c.45.25 1.004-.129.919-.648l-1.056-6.472 4.467-4.579c.354-.362.151-.977-.353-1.054l-6.148-.939L10.565.329c-.206-.439-.925-.439-1.131 0L6.679 6.198l-6.148.939c-.505.078-.707.692-.353 1.054Z" />
    </svg>
  );
}

/** Business statistics row with count-up numbers. */
export function Stats({ stats }: { stats: StatData[] }) {
  return (
    <section className="bg-white py-[30px] bxt:py-[60px] bxd:py-[50px]">
      <Container className="grid grid-cols-2 gap-y-[30px] bxt:flex bxt:flex-row bxt:justify-between">
        {stats.map((s, i) => (
          <Reveal key={s.label} y={24} delay={i * 0.1} className="flex flex-col items-center gap-2.5 bxt:flex-1">
            <div className="flex items-center gap-2.5">
              <CountUp
                value={s.value}
                decimals={s.decimals}
                suffix={s.suffix}
                className="text-[40px] font-semibold leading-10 text-bx-stat"
              />
              {s.star && <Star />}
            </div>
            <p className="text-center text-[15px] font-normal uppercase leading-6 text-bx-ink">{s.label}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
