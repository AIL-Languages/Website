import { Faq } from "@/components/sections/Faq";
import { faqJsonLd } from "@/lib/faq";

export function FaqSection() {
  const json = JSON.stringify(faqJsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: json }}
      />
      <Faq />
    </>
  );
}
