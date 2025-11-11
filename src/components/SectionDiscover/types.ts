export type DiscoverLocationDetail = {
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisine: string;
  distance: string;
  photo: string;
  hours?: {
    open: string; // 24h time e.g. "07:30"
    close: string; // 24h time e.g. "23:00"
  };
};
