import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/sections/About";
import { AcademicDirectorSection } from "@/components/sections/AcademicDirectorSection";
import { ContactCta } from "@/components/sections/ContactCta";
import { Hero } from "@/components/sections/Hero";
import { JoinProfiles } from "@/components/sections/JoinProfiles";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Languages } from "@/components/sections/Languages";
import { Methodology } from "@/components/sections/Methodology";
import { Programs } from "@/components/sections/Programs";
import { PartnershipsSection } from "@/components/sections/PartnershipsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { Translation } from "@/components/sections/Translation";
import { WhyAil } from "@/components/sections/WhyAil";
import { BillingNote } from "@/components/sections/BillingNote";
import { ChooseWhenToLearn } from "@/components/sections/ChooseWhenToLearn";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <AcademicDirectorSection />
        <Languages />
        <ChooseWhenToLearn />
        <HowItWorks />
        <Methodology />
        <Programs />
        <BillingNote />
        <WhyAil />
        <Translation />
        <Testimonials />
        <PartnershipsSection />
        <JoinProfiles />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
