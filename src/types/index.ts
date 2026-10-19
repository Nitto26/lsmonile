export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'smartphones' | 'tablets' | 'smart-watches' | 'earbuds' | 'power-banks' | 'chargers' | 'accessories' | 'components';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  colors: { name: string; hex: string }[];
  storageOptions?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
  overviewHighlights: { title: string; subtitle: string; icon: string }[];
  specifications: Record<string, string>;
  inTheBox: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedStorage?: string;
}

export interface RepairService {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  turnaroundTime: string;
  iconName: 'screen' | 'battery' | 'water' | 'software' | 'camera' | 'other';
}

export interface RepairBooking {
  id: string;
  deviceType: string;
  brand: string;
  model: string;
  issue: string;
  customerName: string;
  phone: string;
  email: string;
  serviceMode: 'doorstep' | 'store';
  scheduledDate: string;
  timeSlot: string;
  notes?: string;
  status: 'Booked' | 'Device Received' | 'Diagnosis' | 'Repairing' | 'Quality Check' | 'Ready';
  statusProgress: number; // 0 to 100
  estimatedCost: number;
  createdAt: string;
}

export interface FilterState {
  search: string;
  category: string;
  brands: string[];
  productTypes: string[];
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';
}
