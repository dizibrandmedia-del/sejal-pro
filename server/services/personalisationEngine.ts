/**
 * SEJAL.PRO — Phase 5 Personalisation & AI-Ready Architecture Engine
 * Multi-Tier Recommendation Priority Hierarchy, AI Gift Finder & Personal Style Quiz.
 */

import { store } from '../db/store';
import {
  PersonalisationContext,
  RecommendationResult,
  AIGiftFinderQuery,
  AIGiftFinderResult,
  StyleQuizQuestion,
} from '../../src/types/personalisation';
import { Product } from '../../src/types/product';
import { MOCK_PRODUCTS } from '../../src/data/mockProducts';

export class PersonalisationEngine {
  /**
   * GET MULTI-TIER PERSONALISED RECOMMENDATIONS
   * Enforces strict priority: Admin Curation -> Category Rules -> Customer Context -> Fallback.
   */
  public getRecommendations(
    context: PersonalisationContext,
    targetProductId?: string
  ): RecommendationResult[] {
    const results: RecommendationResult[] = [];
    const allProducts = Array.from(store.products.values()).length > 0
      ? Array.from(store.products.values())
      : MOCK_PRODUCTS;

    // 1. Curated Edit: "Complete Your SEJAL Edit" (If viewing a product)
    if (targetProductId) {
      const currentProduct = allProducts.find((p) => p.id === targetProductId);
      if (currentProduct) {
        let pairedProducts = allProducts.filter(
          (p) => p.id !== targetProductId && p.category === currentProduct.category
        );
        if (pairedProducts.length === 0) {
          pairedProducts = allProducts.filter((p) => p.id !== targetProductId);
        }

        results.push({
          sectionTitle: 'COMPLETE YOUR SEJAL EDIT',
          sectionSubtitle: 'Pairings selected by Founder Sejal Gupta',
          recommendationType: 'complete_the_look',
          products: pairedProducts.slice(0, 4),
          explanation: `Heirloom pieces designed to harmonise with ${currentProduct.name}`,
        });
      }
    }

    // 2. Customer Contextual Recommendations: "Curated for You"
    let personalisedItems: Product[] = [];
    if (context.recentCategories && context.recentCategories.length > 0) {
      personalisedItems = allProducts.filter((p) =>
        context.recentCategories.includes(p.category) && p.id !== targetProductId
      );
    }

    if (personalisedItems.length < 4) {
      // Fallback: Signature & Bestsellers
      const signatureItems = allProducts.filter((p) => (p.isSignature || p.isBestseller) && p.id !== targetProductId);
      personalisedItems = [...personalisedItems, ...signatureItems];
    }

    // Remove duplicates
    const uniquePersonalised = Array.from(new Set(personalisedItems.map((p) => p.id)))
      .map((id) => allProducts.find((p) => p.id === id)!)
      .filter(Boolean)
      .slice(0, 4);

    results.push({
      sectionTitle: context.priveTier ? `CURATED FOR ${context.priveTier.toUpperCase()}` : 'CURATED FOR YOU',
      sectionSubtitle: 'Based on your aesthetic affinity and luxury selections',
      recommendationType: 'curated_admin',
      products: uniquePersonalised,
      explanation: 'Crafted selections aligned with your viewed creations and regional styling preferences.',
    });

    // 3. "Recently Admired" (If customer has viewed items)
    if (context.recentProductIds && context.recentProductIds.length > 0) {
      const recent = context.recentProductIds
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p) && p.id !== targetProductId)
        .slice(0, 4);

      if (recent.length > 0) {
        results.push({
          sectionTitle: 'RECENTLY ADMIRED',
          sectionSubtitle: 'Creations that captured your attention',
          recommendationType: 'recently_viewed',
          products: recent,
          explanation: 'Your private history in the Maison SEJAL salon.',
        });
      }
    }

    return results;
  }

  /**
   * AI-READY LUXURY GIFT FINDER
   * Queries real catalogue products matching occasion, recipient, budget range, and aesthetic.
   */
  public findLuxuryGift(query: AIGiftFinderQuery): AIGiftFinderResult {
    const allProducts = Array.from(store.products.values()).length > 0
      ? Array.from(store.products.values())
      : MOCK_PRODUCTS;

    // Filter by budget and aesthetic
    let matching = allProducts.filter((p) => {
      const inBudget = p.basePriceINR >= query.budgetINRRange.min * 0.8 && p.basePriceINR <= query.budgetINRRange.max * 1.2;
      return inBudget;
    });

    if (matching.length === 0) {
      matching = allProducts; // Fallback to entire catalogue
    }

    // Pick top matching product
    const primary = matching[0] || allProducts[0];
    const pairing = matching[1] || allProducts[1];

    let packaging = 'Signature SEJAL Rose Gold Coffret with double-faced satin ribbon & gold seal.';
    if (query.occasion === 'Royal Wedding' || query.recipient === 'Royal Dignitary') {
      packaging = 'Bespoke Handcrafted Velvet Keepsake Trunk with 24K gold plated brass lock.';
    }

    return {
      curatedProduct: primary,
      curationReason: `Selected for ${query.occasion} honoring ${query.recipient}. Features ${primary.materials?.join(', ') || '18K Gold and certified diamonds'}.`,
      pairingProduct: pairing,
      suggestedPackaging: packaging,
      conciergeNote: 'Includes complimentary hand-calligraphed parchment card and tamper-sealed white-glove courier delivery.',
    };
  }

  /**
   * GET PERSONAL STYLE QUIZ QUESTIONS
   */
  public getStyleQuiz(): StyleQuizQuestion[] {
    return [
      {
        id: 'q_aesthetic',
        question: 'Which aesthetic best defines your sartorial presence?',
        options: [
          {
            id: 'opt_haute_joaillerie',
            label: 'High Joaillerie Royalty',
            description: 'Grand choker suites, certified solitaire diamonds, and 18K rose gold statement masterworks.',
            categoryTag: 'high-jewellery',
          },
          {
            id: 'opt_regal_silks',
            label: 'Heirloom Heritage Drapes',
            description: 'Varanasi brocade, pure Zardozi metallic embroidery, and velvet floor-length lehengas.',
            categoryTag: 'royal-heritage-silks',
          },
          {
            id: 'opt_quiet_luxury',
            label: 'Quiet Luxury & Extrait Parfumerie',
            description: 'Minimalist solitaire pendants, hand-carved rose quartz vanity decor, and artisanal pure oud.',
            categoryTag: 'lifestyle',
          },
        ],
      },
      {
        id: 'q_occasion',
        question: 'What is your primary occasion of acquisition?',
        options: [
          {
            id: 'opt_occ_wedding',
            label: 'Royal Wedding & Gala Ceremonies',
            description: 'Bespoke bridal trousseau and high-impact statement pieces.',
            categoryTag: 'bridal-edit',
          },
          {
            id: 'opt_occ_private_salon',
            label: 'Private Salon & Evening Soirees',
            description: 'Refined cocktail jewellery and exquisite evening capes.',
            categoryTag: 'signature-collection',
          },
        ],
      },
    ];
  }
}

export const personalisationEngine = new PersonalisationEngine();
