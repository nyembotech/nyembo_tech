export interface HeroCard {
    id?: string;
    title: string;
    subtitle?: string;
    description: string;
    modalContent: string;
    icon?: string;
    imageUrl?: string;
    order: number;
    color?: string; // Hex or Tailwind class for card accent
}
