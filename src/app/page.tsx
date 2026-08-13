import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/sections/About";
import { AcademicDirectorSection } from "@/components/sections/AcademicDirectorSection";
import { BillingNote } from "@/components/sections/BillingNote";
import { ContactCta } from "@/components/sections/ContactCta";
import { ExamPreparationStrip } from "@/components/sections/ExamPreparationStrip";
import { FaqSection } from "@/components/sections/FaqSection";
import { Hero } from "@/components/sections/Hero";
import { JoinProfiles } from "@/components/sections/JoinProfiles";
import { Languages } from "@/components/sections/Languages";
import { Methodology } from "@/components/sections/Methodology";
import { PartnershipsSection } from "@/components/sections/PartnershipsSection";
import { Programs } from "@/components/sections/Programs";
import { SkillsStrip } from "@/components/sections/SkillsStrip";
import { Translation } from "@/components/sections/Translation";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Languages />
        <SkillsStrip />
        <Methodology />
        <About />
        <AcademicDirectorSection />
        <ExamPreparationStrip />
        <Programs />
        <PartnershipsSection />
        <Translation />
        <BillingNote />
        <JoinProfiles />
        <FaqSection />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
