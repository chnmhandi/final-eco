export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const mockFAQs: FAQItem[] = [
  {
    category: "Shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 100 countries worldwide. International shipping is complimentary for orders above $300. Standard international delivery takes between 5-10 business days."
  },
  {
    category: "Shipping",
    question: "How long does standard delivery take?",
    answer: "For domestic orders, standard delivery takes 2-4 business days. Express shipping option is available at checkout, delivering in 1-2 business days."
  },
  {
    category: "Returns",
    question: "What is your returns policy?",
    answer: "We offer a 30-day complimentary returns policy. Items must be returned in their original condition, unworn and with all original tags attached. Custom or bespoke orders are non-refundable."
  },
  {
    category: "Products",
    question: "Are your leather goods sustainably sourced?",
    answer: "All AURA leather goods are hand-crafted from certified full-grain vegetable-tanned leather sourced from Gold-rated tanneries in Europe. We prioritize natural oils over harmful chrome chemicals."
  },
  {
    category: "Orders",
    question: "Can I modify or cancel my order after it has been placed?",
    answer: "Orders are processed quickly by our logistics center. You can modify or cancel your order within 60 minutes of placement directly from your profile settings or by reaching out to our concierge service."
  }
];
