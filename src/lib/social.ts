export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "youtube";

export type SocialLink = {
  name: string;
  platform: SocialPlatform;
  href: string | null;
  enabled: boolean;
  /** Color de marca permanente del icono (alto contraste). */
  brandColor: string;
  brandHover: string;
};

export const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    platform: "facebook",
    href: "https://www.facebook.com/AIL.AInman.Languages",
    enabled: true,
    brandColor: "text-[#1877F2]",
    brandHover:
      "hover:border-[#1877F2]/70 hover:shadow-[0_8px_20px_rgba(24,119,242,0.28)]",
  },
  {
    name: "Instagram",
    platform: "instagram",
    href: "https://www.instagram.com/ail_a.inman_languages/",
    enabled: true,
    brandColor: "text-[#E1306C]",
    brandHover:
      "hover:border-[#E1306C]/55 hover:shadow-[0_8px_20px_rgba(225,48,108,0.25)]",
  },
  {
    name: "LinkedIn",
    platform: "linkedin",
    href: "https://www.linkedin.com/in/a-inman-languages/",
    enabled: true,
    brandColor: "text-[#0A66C2]",
    brandHover:
      "hover:border-[#0A66C2]/70 hover:shadow-[0_8px_20px_rgba(10,102,194,0.28)]",
  },
  {
    name: "YouTube",
    platform: "youtube",
    href: "https://www.youtube.com/@a-inmanlanguages3397",
    enabled: true,
    brandColor: "text-[#FF0000]",
    brandHover:
      "hover:border-[#FF0000]/60 hover:shadow-[0_8px_20px_rgba(255,0,0,0.25)]",
  },
];

export function getActiveSocialLinks() {
  return socialLinks.filter((link) => link.enabled && link.href);
}
