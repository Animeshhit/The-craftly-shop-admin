interface bannerType {
  _id: string;
  bannerImage: string;
  bannerLink?: string;
  bannerText?: string;
  isMainImage: boolean;
  createdAt: string;
}

export type { bannerType };
