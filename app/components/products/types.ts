export interface Product {
  _id: string;
  name: string;
  brief?: string;
  originalPrice: number;
  salePrice?: number;
  price: number;
  discountPercent: number;
  description?: string;
  image?: string;
  images?: string[];
  color?: string;
  storage?: string;
  network?: string;
  screenSize?: string;
  overview?: string;
  overviewImage?: string;
  specifications?: {
    groupName: string;
    items: { label: string; value: string }[];
  }[];
  features?: string[];
  detailedSpecs?: Record<string, Record<string, string>>;
  specs?: {
    screen?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    rearCamera?: string;
    frontCamera?: string;
    battery?: string;
    batteryLife?: string;
    charging?: string;
    os?: string;
    extras?: string;
  };
  freeDelivery: boolean;
  deliveryTime: string;
  warrantyYears: number;
  installment?: {
    available: boolean;
    downPayment?: number;
    months?: number;
    note?: string;
    conditions?: string[];
    policy?: string;
  };
  taxIncluded: boolean;
  category?: string;
  subCategory?: string;
  brand?: string;
  inStock: boolean;
  rating?: {
    average: number;
    count: number;
  };
  reviews?: {
    name: string;
    rate: number;
    comment: string;
    date: string;
  }[];
  colors?: {
    name: string;
    code: string;
  }[];
}
