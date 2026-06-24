export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  longDescription: string;
  colors: { name: string; hex: string }[];
  sizes?: string[];
  specs: ProductSpecification[];
  reviews: Review[];
  stock: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  tag?: string;
}

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "The Meridian Chronograph Watch",
    category: "Accessories",
    price: 345,
    originalPrice: 420,
    rating: 4.8,
    reviewCount: 124,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80"
    ],
    description: "An elegant, precision-crafted timepiece featuring a polished steel body, custom leather strap, and Japanese quartz movement.",
    longDescription: "Designed for the modern voyager, The Meridian Chronograph blends timeless watchmaking traditions with a clean, contemporary design language. Crafted with a 316L stainless steel case, sapphire crystal glass, and a supple vegetable-tanned Italian leather band, it sits comfortably on the wrist for formal galas or casual weekends alike.",
    colors: [
      { name: "Silver & Tan", hex: "#D2B48C" },
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Rose Gold", hex: "#B76E79" }
    ],
    specs: [
      { label: "Case Diameter", value: "40mm" },
      { label: "Case Thickness", value: "8.5mm" },
      { label: "Movement", value: "Miyota Japanese Quartz" },
      { label: "Water Resistance", value: "5 ATM (50 Meters)" },
      { label: "Strap Width", value: "20mm" },
      { label: "Strap Material", value: "Italian Vegetable-Tanned Leather" }
    ],
    reviews: [
      {
        id: "rev-1-1",
        userName: "Julian K.",
        rating: 5,
        date: "May 12, 2026",
        comment: "Absolutely stunning watch. The leather feels premium and the movement is silent and accurate. A real head-turner.",
        helpfulCount: 24
      },
      {
        id: "rev-1-2",
        userName: "Marcus Aurelius",
        rating: 4,
        date: "June 02, 2026",
        comment: "Beautiful minimalist watch. The dial is clean and easy to read. Minor scratch on the clasp after a week, but overall great quality.",
        helpfulCount: 8
      }
    ],
    stock: 12,
    isFeatured: true,
    isTrending: true,
    tag: "Exclusive"
  },
  {
    id: "prod-2",
    name: "Classic Leather Weekender",
    category: "Bags",
    price: 280,
    rating: 4.9,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A spacious travel duffel hand-cut from full-grain leather, built to last a lifetime of journeys.",
    longDescription: "The Ultimate travel companion. Crafted from water-resistant, oil-waxed full-grain cowhide leather that develops a gorgeous dark patina over time. It features a heavy-duty brass zipper, reinforced handles, a padded shoulder strap, and a separate bottom shoe compartment to keep your clothes fresh.",
    colors: [
      { name: "Heritage Brown", hex: "#5C4033" },
      { name: "Cognac Tan", hex: "#A0522D" },
      { name: "Obsidian Black", hex: "#0D0D0D" }
    ],
    specs: [
      { label: "Dimensions", value: "21.5\" L x 10\" W x 11.5\" H" },
      { label: "Volume", value: "40 Liters" },
      { label: "Weight", value: "3.2 lbs" },
      { label: "Hardware", value: "Solid Brass" },
      { label: "Lining", value: "Waterproof Cotton Canvas" }
    ],
    reviews: [
      {
        id: "rev-2-1",
        userName: "Sophia L.",
        rating: 5,
        date: "April 28, 2026",
        comment: "Took this to Paris for a 4-day trip, and it held everything perfectly. Smells amazing and looks so luxury.",
        helpfulCount: 42
      }
    ],
    stock: 25,
    isFeatured: true,
    isBestSeller: true,
    tag: "Best Seller"
  },
  {
    id: "prod-3",
    name: "Aura Sound-Isolation Headphones",
    category: "Electronics",
    price: 320,
    originalPrice: 380,
    rating: 4.7,
    reviewCount: 204,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Wireless over-ear headphones combining premium high-fidelity audio, active hybrid noise cancellation, and a luxurious aluminum trim.",
    longDescription: "Immerse yourself completely. Engineered with custom-tuned 40mm dynamic drivers, the Aura Studio headphones deliver deep, rich bass and crystal-clear highs. Premium memory foam ear cushions wrapped in protein leather provide unmatched all-day comfort, while the active hybrid noise cancellation isolates your environment.",
    colors: [
      { name: "Warm Silver", hex: "#DCDCDC" },
      { name: "Space Grey", hex: "#4A4A4A" }
    ],
    specs: [
      { label: "Battery Life", value: "Up to 36 Hours (ANC ON)" },
      { label: "Bluetooth Version", value: "Bluetooth 5.3" },
      { label: "Driver Size", value: "40mm Custom Dynamic" },
      { label: "Charging", value: "USB-C QuickCharge (10m = 5h)" },
      { label: "Codecs", value: "LDAC, AAC, SBC" }
    ],
    reviews: [
      {
        id: "rev-3-1",
        userName: "Ethan H.",
        rating: 5,
        date: "June 15, 2026",
        comment: "The noise cancellation is rivaling the best in the market. Comfort is exceptional, doesn't clamp the ears.",
        helpfulCount: 15
      }
    ],
    stock: 18,
    isTrending: true,
    tag: "Trending"
  },
  {
    id: "prod-4",
    name: "Nouveau Lounge Chair",
    category: "Home",
    price: 520,
    rating: 4.6,
    reviewCount: 43,
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A mid-century modern accent chair featuring a curved walnut veneer shell and plush boucle upholstery.",
    longDescription: "Bring sculptural elegance to your living room. The Nouveau lounge chair features a molded walnut plywood frame that hugs the body, supported by architectural powder-coated steel legs. Upholstered in premium textured boucle fabric, it is a statement piece that doesn't compromise on sitting ergonomics.",
    colors: [
      { name: "Cream Boucle", hex: "#F5F5DC" },
      { name: "Olive Velvet", hex: "#556B2F" },
      { name: "Charcoal Wool", hex: "#36454F" }
    ],
    specs: [
      { label: "Height", value: "32.5\"" },
      { label: "Width", value: "30\"" },
      { label: "Depth", value: "31.5\"" },
      { label: "Frame Material", value: "Molded Walnut Plywood" },
      { label: "Upholstery", value: "Textured Boucle (90% Polyester, 10% Acrylic)" }
    ],
    reviews: [
      {
        id: "rev-4-1",
        userName: "Eleanor V.",
        rating: 5,
        date: "May 20, 2026",
        comment: "This chair is a work of art. Upholstery is soft and thick, frame is rock solid. Easy to assemble too.",
        helpfulCount: 31
      }
    ],
    stock: 8,
    isFeatured: true,
    tag: "Design Icon"
  },
  {
    id: "prod-5",
    name: "Tailored Linen Trench Coat",
    category: "Apparel",
    price: 195,
    originalPrice: 240,
    rating: 4.5,
    reviewCount: 56,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A lightweight, double-breasted outerwear staple crafted from structured Belgian organic linen.",
    longDescription: "Perfect for transitional layering. The Tailored Linen Trench features a sophisticated double-breasted silhouette, storm flaps, and a removable waist belt. Made from breathable Belgian flax linen, it has been pre-washed to achieve a soft, comfortable texture while keeping a sharp, structured look.",
    colors: [
      { name: "Sand", hex: "#E3C9A8" },
      { name: "Warm Olive", hex: "#707E63" },
      { name: "Navy Blue", hex: "#1D2A44" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    specs: [
      { label: "Material", value: "100% Belgian Organic Flax Linen" },
      { label: "Lining", value: "Unlined for lightweight breathability" },
      { label: "Closure", value: "Horn buttons" },
      { label: "Care", value: "Dry Clean Recommended" }
    ],
    reviews: [
      {
        id: "rev-5-1",
        userName: "Aria R.",
        rating: 5,
        date: "June 10, 2026",
        comment: "Perfect weight for spring and summer evenings. Drapes beautifully and fits true to size.",
        helpfulCount: 11
      }
    ],
    stock: 15,
    isBestSeller: true,
    tag: "Summer Essential"
  },
  {
    id: "prod-6",
    name: "Apex Acetate Sunglasses",
    category: "Accessories",
    price: 135,
    rating: 4.7,
    reviewCount: 78,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Classic D-frame sunglasses made from bio-degradable acetate with polarized, scratch-resistant Carl Zeiss lenses.",
    longDescription: "Timeless styling meets environmental responsibility. The Apex features a robust, bio-degradable cellulose acetate frame fitted with five-barrel metal hinges for premium tactile feedback and durability. The polarized Carl Zeiss lenses offer 100% UVA/UVB protection and ultimate visual clarity.",
    colors: [
      { name: "Tortoiseshell", hex: "#4E3629" },
      { name: "Crystal Olive", hex: "#8FBC8F" },
      { name: "Gloss Black", hex: "#000000" }
    ],
    specs: [
      { label: "Frame Width", value: "142mm" },
      { label: "Lens Width", value: "48mm" },
      { label: "Bridge Width", value: "22mm" },
      { label: "Lens Rating", value: "UV400 Polarized (Zeiss)" },
      { label: "Hinge", value: "German 5-barrel nickel silver" }
    ],
    reviews: [
      {
        id: "rev-6-1",
        userName: "Oliver G.",
        rating: 4,
        date: "May 30, 2026",
        comment: "The lenses are amazing. Very crisp contrast. The crystal olive color is gorgeous in the sunlight.",
        helpfulCount: 6
      }
    ],
    stock: 30,
    isTrending: true,
    tag: "Trending"
  },
  {
    id: "prod-7",
    name: "Ultrasonic Essential Oil Diffuser",
    category: "Home",
    price: 85,
    originalPrice: 110,
    rating: 4.8,
    reviewCount: 142,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A sculptural stone aroma diffuser that doubles as a minimalist nightlight, atomizing scent silently.",
    longDescription: "Elevate your ambient environment. The Aura Stone Diffuser features a hand-crafted ceramic cover modeled to look like natural stone. Equipped with ultrasonic vibrations, it disperses a cool, fragrant mist without heat, preserving the therapeutic integrity of your essential oils. Includes automated safety shutoff and custom ambient glow cycles.",
    colors: [
      { name: "Basalt Grey", hex: "#708090" },
      { name: "Chalk White", hex: "#FDFDFD" },
      { name: "Terracotta", hex: "#C46210" }
    ],
    specs: [
      { label: "Capacity", value: "120ml" },
      { label: "Run Time", value: "4 Hours (Continuous) / 8 Hours (Interval)" },
      { label: "Coverage Area", value: "Up to 500 sq ft" },
      { label: "Power Source", value: "USB-C wall plug (included)" },
      { label: "Material", value: "BPA-free plastic container, Porcelain exterior" }
    ],
    reviews: [
      {
        id: "rev-7-1",
        userName: "Charlotte D.",
        rating: 5,
        date: "June 05, 2026",
        comment: "Diffuses scent perfectly and fits in with my home styling. The light cycle is warm and soothing.",
        helpfulCount: 19
      }
    ],
    stock: 45,
    isBestSeller: true,
    tag: "Wellness"
  },
  {
    id: "prod-8",
    name: "Modular MagSafe Leather Wallet",
    category: "Accessories",
    price: 65,
    rating: 4.4,
    reviewCount: 67,
    images: [
      "https://images.unsplash.com/photo-1627124112126-7d4ad2e67a36?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A ultra-slim magnetic wallet crafted from premium leather, featuring an integrated kickstand and quick-access card slots.",
    longDescription: "The intersection of utility and luxury. Designed with ultra-strong N52 neodymium magnets, it clips securely to any MagSafe-compatible phone. Hand-crafted from full-grain leather, it holds up to three cards, features built-in RFID shielding, and folds open to serve as a sturdy landscape or portrait phone stand.",
    colors: [
      { name: "Obsidian Black", hex: "#121212" },
      { name: "British Tan", hex: "#8B5A2B" },
      { name: "Emerald Green", hex: "#004B49" }
    ],
    specs: [
      { label: "Card Capacity", value: "3 cards max" },
      { label: "Magnet Strength", value: "3200 gauss (Super strong)" },
      { label: "Weight", value: "1.1 oz" },
      { label: "RFID Shielding", value: "Yes, fully shielded" },
      { label: "Kickstand Angles", value: "45° Portrait, 60° Landscape" }
    ],
    reviews: [
      {
        id: "rev-8-1",
        userName: "Leo T.",
        rating: 5,
        date: "April 15, 2026",
        comment: "Magnets are much stronger than the official Apple one. Holds three cards tightly and kickstand function is super useful.",
        helpfulCount: 14
      }
    ],
    stock: 50,
    isTrending: false,
    tag: "Utility"
  },
  {
    id: "prod-9",
    name: "Minimalist Ceramic Coffee Dripper Set",
    category: "Home",
    price: 75,
    rating: 4.8,
    reviewCount: 32,
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80"
    ],
    description: "A pour-over brewing kit with a double-walled ceramic dripper, a custom walnut server stand, and a hand-blown borosilicate glass carafe.",
    longDescription: "Perfect your morning ritual. The double-walled ceramic construction keeps your brewing temperature stable, optimizing extraction efficiency. The carafe holds up to 600ml of pour-over coffee, and the handcrafted American walnut stand brings a luxurious, modern architectural touch to your kitchen counter.",
    colors: [
      { name: "Matte White", hex: "#FBFBFB" },
      { name: "Slate Black", hex: "#2B2B2B" }
    ],
    specs: [
      { label: "Capacity", value: "600ml (1-4 cups)" },
      { label: "Dripper Material", value: "Double-walled glazed stoneware" },
      { label: "Carafe Material", value: "Borosilicate Glass" },
      { label: "Stand Material", value: "FSC-Certified American Walnut, Brass" },
      { label: "Filter Type", value: "V60 size 02 (10 filters included)" }
    ],
    reviews: [
      {
        id: "rev-9-1",
        userName: "Naomi S.",
        rating: 5,
        date: "June 21, 2026",
        comment: "Beautiful coffee maker. Extracts coffee beautifully and looks like a sculpture on my kitchen counter.",
        helpfulCount: 5
      }
    ],
    stock: 14,
    isFeatured: true,
    tag: "Kitchen Craft"
  },
  {
    id: "prod-10",
    name: "Bespoke Silk Pajama Set",
    category: "Apparel",
    price: 220,
    rating: 4.9,
    reviewCount: 45,
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Premium sleepwear set tailored from 100% 22-Momme organic Mulberry silk, featuring piping details and an elastic drawstring waist.",
    longDescription: "Indulge in pure comfort. mulberry silk regulates temperature, retains skin hydration, and feels extraordinarily soft. The long-sleeve top features a notched collar and mother-of-pearl buttons, and the relaxed pants offer a flexible elastic drawstring waistband for premium ease.",
    colors: [
      { name: "Champagne Pearl", hex: "#E8D8C8" },
      { name: "Midnight Navy", hex: "#1A2535" },
      { name: "Emerald", hex: "#0E3A2F" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    specs: [
      { label: "Material", value: "100% Organic Mulberry Silk (22 Momme)" },
      { label: "Fit", value: "Relaxed tailored fit" },
      { label: "Buttons", value: "100% Genuine Mother of Pearl" },
      { label: "Certifications", value: "OEKO-TEX® Standard 100" }
    ],
    reviews: [
      {
        id: "rev-10-1",
        userName: "Vicky L.",
        rating: 5,
        date: "June 14, 2026",
        comment: "Pure luxury. Keeps me cool all night and feels like a second skin. Definitely worth the investment.",
        helpfulCount: 12
      }
    ],
    stock: 10,
    isBestSeller: true,
    tag: "Luxury Sleep"
  }
];
