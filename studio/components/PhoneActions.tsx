import { Button, Flex, Stack } from "@sanity/ui";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import type { StringInputProps } from "sanity";

/** Moroccan local number (06…) → international digits for wa.me (2126…). */
const toWhatsApp = (digits: string) => (digits.startsWith("0") ? `212${digits.slice(1)}` : digits);

/** Phone field of a lead, with « Appeler » and « WhatsApp » buttons under it. */
export function PhoneActions(props: StringInputProps) {
  const digits = (props.value ?? "").replace(/\D/g, "");
  return (
    <Stack gap={3}>
      {props.renderDefault(props)}
      {digits && (
        <Flex gap={2}>
          <Button as="a" href={`tel:${digits}`} text="Appeler" tone="primary" mode="default" />
          <Button as="a" href={`https://wa.me/${toWhatsApp(digits)}`} target="_blank" rel="noopener noreferrer" text="WhatsApp" tone="positive" mode="ghost" />
        </Flex>
      )}
    </Stack>
  );
}

/** Email field of a lead, with a « Répondre » button. */
export function EmailActions(props: StringInputProps) {
  return (
    <Stack gap={3}>
      {props.renderDefault(props)}
      {props.value && (
        <Flex>
          <Button as="a" href={`mailto:${props.value}`} icon={EnvelopeIcon} text="Répondre par email" mode="ghost" />
        </Flex>
      )}
    </Stack>
  );
}
