import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/social/SocialLinks";
import { getCmsContent } from "@/lib/cms/store";
import { site, whatsappLink } from "@/lib/site";

export async function ContactCta() {
  const { contact } = await getCmsContent();

  return (
    <section id="contacto" className="bg-card py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-8">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan">
            {contact.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{contact.body}</p>

          <ul className="mt-6 space-y-2 text-sm text-ink/85">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-ail-cyan">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ail-cyan"
              >
                WhatsApp {site.phoneDisplay}
              </a>
            </li>
            <li>{site.location}</li>
            <li>Clases 100% online</li>
          </ul>

          <div className="mt-10 border-t border-navy/10 pt-8">
            <h3 className="font-display text-lg font-semibold text-ink">
              {contact.socialTitle}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              {contact.socialBody}
            </p>
            <SocialLinks
              variant="onLight"
              layout="labeled"
              className="mt-5"
              align="start"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
