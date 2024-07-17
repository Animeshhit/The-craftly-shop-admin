interface ProductField {
  value: string | undefined | number;
  error: boolean;
}

// interface NewProductType {
//   name: string;
//   stock: number | string | undefined;
//   productUniqueId: string;
//   basePrice: number | string | undefined;
//   discountedPrice: number | string | undefined;
//   categories: string;
//   mainImage: string;
// }

interface NewProductType {
  name: { value: string; error: boolean };
  stock: { value: number | string | undefined; error: boolean };
  productUniqueId: { value: string; error: boolean };
  basePrice: { value: number | string | undefined; error: boolean };
  discountedPrice: { value: number | string | undefined; error: boolean };
  categories: { value: string; error: boolean };
  mainImage: { value: string; error: boolean };
  //others
  isFeatured: boolean;
  isBestSeller: boolean;
}

// interface NewProductType {
//   name: ProductField;
//   stock: ProductField;
//   productUniqueId: ProductField;
//   basePrice: ProductField;
//   discountedPrice: ProductField;
//   categories: ProductField;
//   mainImage: ProductField;
// }

export type { NewProductType, ProductField };
