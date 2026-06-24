export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Apparel",
    slug: "apparel",
    description: "Sustainably-made clothing tailored for modern ease and comfort.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    itemCount: 24
  },
  {
    id: "cat-2",
    name: "Bags",
    slug: "bags",
    description: "Luxury travel gear hand-cut from premium full-grain leathers.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    itemCount: 12
  },
  {
    id: "cat-3",
    name: "Electronics",
    slug: "electronics",
    description: "Acoustics and devices reimagined with clean luxury trims.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    itemCount: 15
  },
  {
    id: "cat-4",
    name: "Accessories",
    slug: "accessories",
    description: "Handcrafted chronographs, wallets, and acetate sunglasses.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    itemCount: 38
  },
  {
    id: "cat-5",
    name: "Home",
    slug: "home",
    description: "Sculptural accent furniture and wellness aroma diffusers.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
    itemCount: 18
  }
];
