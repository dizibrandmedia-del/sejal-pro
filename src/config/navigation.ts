export interface NavCategoryItem {
  name: string;
  slug: string;
  featured?: boolean;
  subcategories: { name: string; slug: string }[];
}

export const MAIN_NAVIGATION: NavCategoryItem[] = [
  {
    name: 'High Jewellery',
    slug: 'high-jewellery',
    featured: true,
    subcategories: [
      { name: 'Diamond & Gemstone Necklaces', slug: 'necklaces' },
      { name: 'Earrings & Drops', slug: 'earrings' },
      { name: 'Haute Solitaire Rings', slug: 'rings' },
      { name: 'Cuffs & Bracelets', slug: 'bracelets' },
      { name: 'Bridal Parures & Sets', slug: 'sets' },
    ],
  },
  {
    name: 'Haute Couture & Silk',
    slug: 'haute-couture-silk',
    featured: true,
    subcategories: [
      { name: 'Evening Gowns & Drapes', slug: 'evening-gowns' },
      { name: 'Pure Mulberry Silk Robes', slug: 'silk-robes' },
      { name: 'Cashmere & Wool Capes', slug: 'capes' },
      { name: 'Cocktail Ensembles', slug: 'cocktail-ensembles' },
    ],
  },
  {
    name: 'Leather Goods',
    slug: 'leather-goods',
    subcategories: [
      { name: 'Signature Structured Handbags', slug: 'handbags' },
      { name: 'Evening Clutches & Minaudières', slug: 'clutches' },
      { name: 'Petite Wallets & Cardholders', slug: 'wallets' },
      { name: 'Artisanal Travel Trunks', slug: 'travel-trunks' },
    ],
  },
  {
    name: 'Niche Fragrance',
    slug: 'niche-fragrance',
    subcategories: [
      { name: 'Extrait de Parfum', slug: 'extrait-de-parfum' },
      { name: 'Rose Gold Elixirs', slug: 'elixirs' },
      { name: 'Silk Body Cremes', slug: 'body-cremes' },
      { name: 'Private Blend Discovery Sets', slug: 'discovery-sets' },
    ],
  },
  {
    name: 'Royal Horology',
    slug: 'royal-horology',
    subcategories: [
      { name: 'Diamond Bezel Timepieces', slug: 'diamond-watches' },
      { name: 'Rose Gold Mesh Watches', slug: 'mesh-watches' },
      { name: 'Moonphase Complications', slug: 'moonphase' },
    ],
  },
  {
    name: 'Artisanal Living',
    slug: 'artisanal-living',
    subcategories: [
      { name: 'Crystal Scented Candles', slug: 'candles' },
      { name: 'Hand-Embroidered Silk Cushions', slug: 'cushions' },
      { name: 'Rose Quartz Vanity Trays', slug: 'vanity-trays' },
      { name: '24K Gold Trim Porcelain', slug: 'porcelain' },
    ],
  },
];

export const EDITORIAL_LINKS = [
  { name: 'Our Story', path: '/story', description: 'The heritage and vision of founder Sejal Gupta' },
  { name: 'SEJAL Privé', path: '/prive', description: 'By-invitation-only private shopping salon & VIP perks' },
  { name: 'The Art of Gifting', path: '/gifting', description: 'Bespoke ribbons, custom calligraphy, and royal packaging' },
  { name: 'Editorial Journal', path: '/journal', description: 'Haute lifestyle chronicles & styling curation' },
];

export const FOOTER_COLUMNS = {
  maison: [
    { name: 'Our Story', path: '/story' },
    { name: 'The Founder', path: '/story#founder' },
    { name: 'SEJAL Privé Salon', path: '/prive' },
    { name: 'Sustainability & Haute Ethics', path: '/story#ethics' },
    { name: 'Artisanal Craftsmanship', path: '/story#craft' },
    { name: 'Editorial Journal', path: '/journal' },
  ],
  services: [
    { name: 'White-Glove Concierge', path: '/account?tab=concierge' },
    { name: 'Private Styling Appointments', path: '/prive#salon' },
    { name: 'Bespoke Haute Joaillerie', path: '/prive#bespoke' },
    { name: 'The Art of Gifting', path: '/gifting' },
    { name: 'Bridal Registry', path: '/gifting#bridal' },
    { name: 'Corporate & Royal Commissions', path: '/gifting#corporate' },
  ],
  care: [
    { name: 'Complimentary Insured Shipping', path: '/shipping-policy' },
    { name: 'Discreet Packaging Guarantee', path: '/packaging' },
    { name: 'Authenticity Certification', path: '/authenticity' },
    { name: 'Private Returns & Exchanges', path: '/returns' },
    { name: 'Care & Preservation Guide', path: '/care-guide' },
    { name: 'Track Your Selection', path: '/account?tab=orders' },
  ],
};
