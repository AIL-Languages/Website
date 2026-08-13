export type {
  FaqAudience,
  FaqCategory,
  FaqCategoryId,
  FaqCta,
  FaqItem,
} from "@/lib/faq/types";
export { faqRouteTodos, faqRoutes } from "@/lib/faq/routes";
export {
  faqCategories,
  faqCategoryLabel,
  faqItems,
  getPublicFaqItems,
  matchesFaqQuery,
  sortFaqItems,
} from "@/lib/faq/data";
export { buildFaqJsonLd, faqJsonLd } from "@/lib/faq/schema";
export { trackFaqEvent } from "@/lib/faq/track";
