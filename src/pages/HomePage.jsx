// src/pages/HomePage.jsx
import HeroSearch from "../components/home/HeroSearch";
import OperatorsSection from "../components/home/OperatorsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import TopRoutes from "../components/home/TopRoutes";
import ReviewsSection from "../components/home/ReviewsSection";
import FaqSection from "../components/home/FaqSection";
import CtaSection from "../components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <OperatorsSection />
      <FeaturesSection />
      <TopRoutes />
      <ReviewsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}