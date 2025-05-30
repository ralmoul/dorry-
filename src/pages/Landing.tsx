
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { WorkflowSteps } from '@/components/landing/WorkflowSteps';
import { AboutSection } from '@/components/landing/AboutSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Navigation } from '@/components/landing/Navigation';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <StatsSection />
      <WorkflowSteps />
      <AboutSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
