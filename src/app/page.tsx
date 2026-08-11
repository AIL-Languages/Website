import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/sections/About";
import { ContactCta } from "@/components/sections/ContactCta";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { JoinProfiles } from "@/components/sections/JoinProfiles";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Languages } from "@/components/sections/Languages";
import { Methodology } from "@/components/sections/Methodology";
import { Programs } from "@/components/sections/Programs";
import { Testimonials } from "@/components/sections/Testimonials";
import { Translation } from "@/components/sections/Translation";
import { WhyAil } from "@/components/sections/WhyAil";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <JoinProfiles />
        <About />
        <Languages />
        <HowItWorks />
        <Methodology />
        <Programs />
        <WhyAil />
        <Experience />
        <Translation />
        <Testimonials />
        <ContactCta />
      </main>
      <Footer />
    </>
  );
}
