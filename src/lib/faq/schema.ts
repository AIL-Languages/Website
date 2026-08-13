import { getPublicFaqItems } from "@/lib/faq/data";
import { site } from "@/lib/site";

export function buildFaqJsonLd() {
  const items = getPublicFaqItems();

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `Preguntas frecuentes | ${site.name}`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const faqJsonLd = buildFaqJsonLd();
