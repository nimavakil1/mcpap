// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  customerNumber: string;
  customerGroupId?: string | null;
  customerGroup?: CustomerGroup | null;
  isVerifiedBusiness: boolean;
  canPurchaseOnInvoice: boolean;
  totalOnlinePurchases: number;
  billingStreet?: string | null;
  billingCity?: string | null;
  billingPostalCode?: string | null;
  billingCountry?: string | null;
  shippingStreet?: string | null;
  shippingCity?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerGroup {
  id: string;
  name: string;
  discountPercentage: number;
  description?: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
}

// Product types
export interface Product {
  id: string;
  sku: string;
  ean?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  manufacturer?: string | null;
  manufacturerSku?: string | null;
  categoryId?: string | null;
  category?: Category | null;
  basePrice: number;
  taxRate: number;
  isAvailableOnline: boolean;
  stockQuantity: number;
  minimumOrderQuantity: number;
  unitOfMeasure: string;
  unitsPerPackage?: number | null;
  packagesPerCarton?: number | null;
  weightGrams?: number | null;
  lengthMm?: number | null;
  widthMm?: number | null;
  heightMm?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  value: string;
  sortOrder: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

// Cart types
export interface Cart {
  id: string;
  userId: string;
  name?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod?: string | null;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  voucher?: StoreVoucher | null;
  invoice?: Invoice | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Address type
export interface Address {
  firstName: string;
  lastName: string;
  companyName?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Voucher types
export interface StoreVoucher {
  id: string;
  userId: string;
  orderId: string;
  code: string;
  amount: number;
  isRedeemed: boolean;
  redeemedAt?: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

// Invoice type
export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  totalAmount: number;
  pdfPath?: string | null;
  issuedAt: Date;
}

// Contact submission type
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Settings type
export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string | null;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  manufacturer?: string;
  inStock?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'basePrice' | 'createdAt';
  direction: 'asc' | 'desc';
}

// Session type for auth
export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  customerNumber: string;
  customerGroupId?: string;
  discountPercentage: number;
  isAdmin?: boolean;
  adminRole?: 'super_admin' | 'admin' | 'editor';
}

// Import types
export interface ProductImportRow {
  sku: string;
  ean?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  manufacturer?: string;
  category?: string;
  subcategory?: string;
  basePrice: number;
  taxRate?: number;
  isAvailableOnline?: boolean;
  stockQuantity?: number;
  minimumOrderQuantity?: number;
  unitOfMeasure?: string;
  unitsPerPackage?: number;
  weightGrams?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: { row: number; message: string }[];
}
