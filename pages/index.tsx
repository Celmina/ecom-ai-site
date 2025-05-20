// pages/index.tsx
import type { NextPage } from "next";
import Hero from "../components/Hero";
import VideoSection from "../components/VideoSection";
import ServicesSection from "../components/ServiceSection";
import WhyScoringSection from "../components/WhyScoringSection";

const Home: NextPage = () => {
  return (
    <>
      <div className="page-wrapper">
        <Hero />
        <ServicesSection />
        <WhyScoringSection />
      </div>
    </>
  );
};

export default Home;
