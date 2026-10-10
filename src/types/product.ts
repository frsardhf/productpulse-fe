export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  sourceProvider?: string | null;
  sourceVariantId?: string | null;
  sourceUrl?: string | null;
  sourceVendor?: string | null;
  sourceCategory?: string | null;
  variantLabel?: string | null;
  sourcePrice?: number | string | null;
  sourceCurrency?: string | null;
  sourceAvailable?: boolean | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  imageRightsStatus?: "UNVERIFIED" | "PERMITTED" | "PLACEHOLDER_ONLY";
  sourceLicense?: string | null;
  sourceAttribution?: string | null;
  catalogueActive?: boolean;
}

export interface UpdatedProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
}
