/** Asset root for the siaracash.ma clone (downloaded by scripts/download-assets-siaracash-ma-449ca86b-root-8a5edab2.mjs). */
export const A = "/sites/siaracash-ma-449ca86b/root-8a5edab2";

/** Home of this version of the site. */
export const HOME = "/";

/** MoziMotors logo in place of the SIARACA$H wordmark (same 1.47em-tall footprint). */
export function Logo({ white = false, height = 32 }: { white?: boolean; height?: number }) {
  return (
    <img
      src={white ? "/brand/mozi-logo-white.png" : "/brand/mozi-logo-dark.png"}
      alt="MoziMotors"
      width={900}
      height={198}
      style={{ height, width: "auto" }}
      className="block"
    />
  );
}

export const waLink = (number: string, text = "Bonjour MoziMotors") => `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
