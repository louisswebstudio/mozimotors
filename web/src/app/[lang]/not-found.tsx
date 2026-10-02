import { getI18n } from "@/i18n/server";
import { H1, PageSheet } from "@/components/sites/boxcars-framer-website-cd8da657/shared/page";
import { BxButton, Container } from "@/components/sites/boxcars-framer-website-cd8da657/root-8a5edab2/ui";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <PageSheet>
      <Container className="flex flex-col items-center pb-[120px] pt-[90px] text-center">
        <p className="text-[80px] font-bold leading-none text-bx-blue bxt:text-[120px]">404</p>
        <h1 className={`${H1} mt-5`}>{t.notFound.title}</h1>
        <p className="mt-2.5 text-[15px] leading-6 text-bx-ink">{t.notFound.text}</p>
        <div className="mt-[30px] flex flex-wrap items-center justify-center gap-2.5">
          <BxButton href="/acheter">{t.common.seeCars}</BxButton>
          <BxButton href="/" variant="link">{t.nav.home}</BxButton>
        </div>
      </Container>
    </PageSheet>
  );
}
