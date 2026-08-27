import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection/HeroSection';
import { ValuePillarsSection } from '../components/home/ValuePillarsSection/ValuePillarsSection';
import { SignatureSection } from '../components/home/SignatureSection/SignatureSection';
import { CategoryPortals } from '../components/home/CategoryPortals/CategoryPortals';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection/NewArrivalsSection';
import { SejalEditSection } from '../components/home/SejalEditSection/SejalEditSection';
import { GiftingExperience } from '../components/home/GiftingExperience/GiftingExperience';
import { FounderStorySection } from '../components/home/FounderStorySection/FounderStorySection';
import { PriveSection } from '../components/home/PriveSection/PriveSection';
import { FlagshipShowroom } from '../components/home/FlagshipShowroom/FlagshipShowroom';
import { NewsletterSection } from '../components/home/NewsletterSection/NewsletterSection';
import { productService } from '../services/productService';
import { cmsService } from '../services/cmsService';
import { HomepageSection } from '../types/cms';

export const HomePage: React.FC = () => {
  const allProducts = productService.getAllProducts();
  const categories = productService.getCategories();
  const [sections, setSections] = useState<HomepageSection[]>([]);

  useEffect(() => {
    const loadSections = async () => {
      const liveSections = await cmsService.getActiveHomepageSections();
      if (liveSections && liveSections.length > 0) {
        setSections(liveSections);
      }
    };
    loadSections();
  }, []);

  const renderSectionComponent = (type: string, key: string) => {
    switch (type) {
      case 'hero':
        return <HeroSection key={key} />;
      case 'value_pillars':
        return <ValuePillarsSection key={key} />;
      case 'signature_collection':
        return <SignatureSection key={key} products={allProducts} />;
      case 'category_portals':
        return <CategoryPortals key={key} categories={categories} />;
      case 'new_arrivals':
        return <NewArrivalsSection key={key} products={allProducts} />;
      case 'curated_edit':
        return <SejalEditSection key={key} products={allProducts} />;
      case 'gifting_experience':
        return <GiftingExperience key={key} />;
      case 'founder_story':
        return <FounderStorySection key={key} />;
      case 'prive_salon':
        return <PriveSection key={key} />;
      case 'flagship_showroom':
        return <FlagshipShowroom key={key} />;
      case 'newsletter':
        return <NewsletterSection key={key} />;
      default:
        return null;
    }
  };

  return (
    <main>
      {sections.length > 0 ? (
        sections.map((sec) => renderSectionComponent(sec.type, sec.id))
      ) : (
        /* Fallback Default Layout if CMS offline */
        <>
          <HeroSection />
          <ValuePillarsSection />
          <SignatureSection products={allProducts} />
          <CategoryPortals categories={categories} />
          <NewArrivalsSection products={allProducts} />
          <SejalEditSection products={allProducts} />
          <GiftingExperience />
          <FounderStorySection />
          <PriveSection />
          <FlagshipShowroom />
          <NewsletterSection />
        </>
      )}
    </main>
  );
};
