import { pgTable, serial, varchar, text, decimal, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table - includes suppliers, clinics, and other roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("customer"), // supplier, customer, admin, dentist
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  avatar: text("avatar"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Supplier profiles
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  arabicCompanyName: varchar("arabic_company_name", { length: 255 }),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  speciality: varchar("speciality", { length: 255 }),
  location: varchar("location", { length: 255 }),
  established: integer("established"),
  verified: boolean("verified").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  totalProducts: integer("total_products").default(0),
  totalOrders: integer("total_orders").default(0),
  website: varchar("website", { length: 255 }),
  badges: jsonb("badges").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  icon: varchar("icon", { length: 255 }),
  image: text("image"),
  parentId: integer("parent_id"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Brands
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  logo: text("logo"),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  website: varchar("website", { length: 255 }),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  brandId: integer("brand_id").references(() => brands.id),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  sku: varchar("sku", { length: 100 }).unique().notNull(),
  barcode: varchar("barcode", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discount: integer("discount").default(0),
  stockQuantity: integer("stock_quantity").default(0),
  minOrderQuantity: integer("min_order_quantity").default(1),
  maxOrderQuantity: integer("max_order_quantity"),
  weight: varchar("weight", { length: 50 }),
  dimensions: varchar("dimensions", { length: 100 }),
  image: text("image").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]),
  arabicFeatures: jsonb("arabic_features").$type<string[]>().default([]),
  specifications: jsonb("specifications").default({}),
  arabicSpecifications: jsonb("arabic_specifications").default({}),
  tags: jsonb("tags").$type<string[]>().default([]),
  arabicTags: jsonb("arabic_tags").$type<string[]>().default([]),
  warranty: varchar("warranty", { length: 100 }),
  certification: jsonb("certification").$type<string[]>().default([]),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  viewCount: integer("view_count").default(0),
  orderCount: integer("order_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isActive: boolean("is_active").default(true),
  freeShipping: boolean("free_shipping").default(false),
  estimatedDays: varchar("estimated_days", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 100 }).unique().notNull(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: varchar("payment_method", { length: 100 }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0.00"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0.00"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address"),
  notes: text("notes"),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  estimatedDelivery: timestamp("estimated_delivery"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  supplierId: integer("supplier_id").references(() => suppliers.id).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productArabicName: varchar("product_arabic_name", { length: 255 }),
  productImage: text("product_image"),
  sku: varchar("sku", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, confirmed, shipped, delivered, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cart
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Favorites/Wishlist
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  images: jsonb("images").$type<string[]>().default([]),
  isVerified: boolean("is_verified").default(false), // verified purchase
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  supplierProfile: one(suppliers, {
    fields: [users.id],
    references: [suppliers.userId],
  }),
  orders: many(orders),
  cart: many(cart),
  favorites: many(favorites),
  reviews: many(reviews),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  user: one(users, {
    fields: [suppliers.userId],
    references: [users.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cart),
  favorites: many(favorites),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [orderItems.supplierId],
    references: [suppliers.id],
  }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cart.productId],
    references: [products.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

// Clinics table - dental clinics registered in the platform
export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // optional - if clinic has user account
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: text("address").notNull(),
  arabicAddress: text("arabic_address"),
  governorate: varchar("governorate", { length: 100 }).notNull(), // المحافظة
  city: varchar("city", { length: 100 }).notNull(),
  locationLat: decimal("location_lat", { precision: 10, scale: 7 }).notNull(),
  locationLng: decimal("location_lng", { precision: 10, scale: 7 }).notNull(),
  specialty: jsonb("specialty").$type<string[]>().default([]), // specialties array
  arabicSpecialty: jsonb("arabic_specialty").$type<string[]>().default([]),
  doctorName: varchar("doctor_name", { length: 255 }),
  arabicDoctorName: varchar("arabic_doctor_name", { length: 255 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  image: text("image"),
  images: jsonb("images").$type<string[]>().default([]),
  workingHours: jsonb("working_hours").default({}), // { saturday: "9:00-17:00", ... }
  services: jsonb("services").$type<string[]>().default([]),
  arabicServices: jsonb("arabic_services").$type<string[]>().default([]),
  
  // Subscription & Promotion fields
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default("free"), // free, basic, premium, enterprise
  subscriptionStart: timestamp("subscription_start"),
  subscriptionEnd: timestamp("subscription_end"),
  isPromoted: boolean("is_promoted").default(false), // paid promotion
  priorityLevel: integer("priority_level").default(0), // 0 = normal, higher = more priority
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscription Plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  arabicName: varchar("arabic_name", { length: 255 }).notNull(),
  description: text("description"),
  arabicDescription: text("arabic_description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationMonths: integer("duration_months").notNull(), // subscription duration in months
  features: jsonb("features").$type<string[]>().default([]),
  arabicFeatures: jsonb("arabic_features").$type<string[]>().default([]),
  canBePromoted: boolean("can_be_promoted").default(false), // can clinics with this plan be promoted
  maxPriorityLevel: integer("max_priority_level").default(0), // maximum priority for this plan
  showInTop: boolean("show_in_top").default(false), // show in top results
  maxMonthlyAppearances: integer("max_monthly_appearances"), // limit on how many times shown per month
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Clinic Payments
export const clinicPayments = pgTable("clinic_payments", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").references(() => clinics.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  paymentMethod: varchar("payment_method", { length: 100 }), // stripe, paypal, cash, etc
  stripePaymentId: varchar("stripe_payment_id", { length: 255 }), // Stripe payment ID
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }), // Stripe customer ID
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, completed, failed, refunded
  paymentDate: timestamp("payment_date"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  invoiceUrl: text("invoice_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Map Settings - for managing Google Maps API and settings
export const mapSettings = pgTable("map_settings", {
  id: serial("id").primaryKey(),
  googleMapsApiKey: varchar("google_maps_api_key", { length: 500 }),
  defaultCenterLat: decimal("default_center_lat", { precision: 10, scale: 7 }).default("33.3152"), // Baghdad center
  defaultCenterLng: decimal("default_center_lng", { precision: 10, scale: 7 }).default("44.3661"), // Baghdad center
  defaultZoom: integer("default_zoom").default(12),
  enableGeolocation: boolean("enable_geolocation").default(true),
  searchRadius: integer("search_radius").default(50), // km
  maxClinicsToShow: integer("max_clinics_to_show").default(20),
  promotedClinicsFirst: boolean("promoted_clinics_first").default(true), // show promoted clinics first
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const clinicsRelations = relations(clinics, ({ one, many }) => ({
  user: one(users, {
    fields: [clinics.userId],
    references: [users.id],
  }),
  payments: many(clinicPayments),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  payments: many(clinicPayments),
}));

export const clinicPaymentsRelations = relations(clinicPayments, ({ one }) => ({
  clinic: one(clinics, {
    fields: [clinicPayments.clinicId],
    references: [clinics.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [clinicPayments.planId],
    references: [subscriptionPlans.id],
  }),
}));
