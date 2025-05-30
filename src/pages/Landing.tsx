
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { WorkflowSteps } from '@/components/landing/WorkflowSteps';
import { AboutSection } from '@/components/landing/AboutSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Navigation } from '@/components/landing/Navigation';
import { useLandingAnimations } from '@/hooks/useLandingAnimations';

const Landing = () => {
  const {
    isNavScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeFeature,
    setActiveFeature,
    handleMouseMove
  } = useLandingAnimations();

  return (
    <div className="min-h-screen" onMouseMove={handleMouseMove}>
      <Navigation 
        isNavScrolled={isNavScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <HeroSection />
      <FeaturesSection 
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />
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
