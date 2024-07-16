interface bannerType {
  _id: string;
  bannerImage: string;
  bannerLink?: string;
  bannerText?: string;
  isMainImage: boolean;
  createdAt: string;
  __v: number;
}

export type { bannerType };
