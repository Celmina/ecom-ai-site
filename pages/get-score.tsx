// pages/get-score.js or pages/get-score.tsx
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GetScoreSection from "../components/GetScoreSection";

export default function GetScorePage() {
  return (
    <>
      <Head>
        <title>Get Your AI Visibility Score | ecom.ai</title>
        <meta
          name="description"
          content="Find out how visible your e-commerce store is to AI assistants like ChatGPT with our free AEO assessment."
        />
      </Head>

      <div className="page-wrapper">
        <GetScoreSection />
      </div>
    </>
  );
}
