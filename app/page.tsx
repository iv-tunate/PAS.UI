import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RolesMarquee from "@/components/RolesMarquee";
import Backdrop from "@/components/ui/Backdrop";
import About from "@/components/About";
import PhotoStage from "@/components/PhotoStage";
import Books from "@/components/Books";
import Watch from "@/components/Watch";
import GatewayNation from "@/components/GatewayNation";
import Vision from "@/components/Vision";
import Visit from "@/components/Visit";
import RelearnIntro from "@/components/RelearnIntro";
import Events from "@/components/Events";
import StudyJournal from "@/components/StudyJournal";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Watch />
        <RolesMarquee />
        <Backdrop variant="aurora-a">
          <About />
        </Backdrop>
        <PhotoStage />
        <Backdrop variant="lattice">
          <Books />
        </Backdrop>
        <GatewayNation />
        <Backdrop variant="lattice">
          <Vision />
        </Backdrop>
        <Backdrop variant="aurora-b">
          <Visit />
        </Backdrop>
        <RelearnIntro />
        <Events />
        <Backdrop variant="aurora-a">
          <StudyJournal />
        </Backdrop>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
