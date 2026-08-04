export type PropertyCard = {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  rating: number;
  ratingLabel: string;
  price: number;
  priceLabel: string;
  isFeatured?: boolean;
  isLiked?: boolean;
  excepcional?: boolean;
  href?: string;
};
