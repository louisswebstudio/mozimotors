import { notFound } from "next/navigation";

/** Any unknown URL under a locale renders that locale's 404 (app/[lang]/not-found.tsx) inside the site layout. */
export default function CatchAll() {
  notFound();
}
