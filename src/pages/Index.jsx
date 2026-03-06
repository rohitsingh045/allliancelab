import Header from "@/components/Header.jsx";
import HeroSection from "@/components/HeroSection.jsx";
import QuickActions from "@/components/QuickActions.jsx";
import HealthConditions from "@/components/HealthConditions.jsx";
import TestsSection from "@/components/TestsSection.jsx";
import HealthPackages from "@/components/HealthPackages.jsx";
import WhyChooseUs from "@/components/WhyChooseUs.jsx";
import Footer from "@/components/Footer.jsx";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <QuickActions />
      <TestsSection />
      <HealthPackages />
      <HealthConditions />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Index;
