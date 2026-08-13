import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/social/SocialLinks";
import { getCmsContent } from "@/lib/cms/store";
import { site, whatsappLink } from "@/lib/site";

export async function ContactCta() {
  const { contact } = await getCmsContent();

  return (
    <section id="contacto" className="ail-section ail-section--navy">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-8">
        <div>
          <p className="ail-kicker">{contact.eyebrow}</p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {contact.title}
          </h2>
          <p className="ail-lead mt-5 max-w-xl leading-relaxed">{contact.body}</p>

          <ul className="mt-6 space-y-2 text-sm text-white">
            <li>
              <a href={`mailto:${site.email}`} className="text-ail-aqua hover:text-ail-aqua-soft">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ail-aqua hover:text-ail-aqua-soft"
              >
                WhatsApp {site.phoneDisplay}
              </a>
            </li>
            <li>{site.location}</li>
            <li>Clases 100% online</li>
          </ul>

          <div className="mt-10 border-t border-white/15 pt-8">
            <h3 className="font-display text-lg font-semibold text-white">
              {contact.socialTitle}
            </h3>
            <p className="ail-lead mt-2 max-w-md text-sm leading-relaxed">
              {contact.socialBody}
            </p>
            <SocialLinks
              variant="onDark"
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
