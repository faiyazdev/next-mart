import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const User = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("emailIndex").on(table.email)]
);

export const Product = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(), // URL-friendly identifier
  description: text("description"),
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),

  // --- Pricing & Inventory ---
  priceInCents: integer("price_in_cents").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  isAvailableForPurchase: boolean("is_available_for_purchase")
    .notNull()
    .default(true),

  // --- File Paths ---
  imagePath: text("image_path"),
  // Path/URL to a downloadable file (e.g., PDF manual, software installer)
  filePath: text("file_path"),

  // --- Timestamps ---
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Order = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  pricePaidInCents: integer("price_paid_in_cents").notNull(),

  // --- Customer/User and Product Reference ---
  userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => Product.id, {
    onDelete: "restrict",
  }),

  // --- Timestamps ---
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const DownloadVerification = pgTable("download_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  expires_at: timestamp("expires_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  productId: uuid("product_id").references(() => Product.id, {
    onDelete: "cascade",
  }),
});

// --- Relations ---

export const UserRelations = relations(User, ({ many }) => ({
  orders: many(Order),
}));

export const ProductRelations = relations(Product, ({ one, many }) => ({
  user: one(User, {
    fields: [Product.userId],
    references: [User.id],
  }),
  orders: many(Order),
  downloadVerifications: many(DownloadVerification),
}));

export const OrderRelations = relations(Order, ({ one }) => ({
  user: one(User, {
    fields: [Order.userId],
    references: [User.id],
  }),
  product: one(Product, {
    fields: [Order.productId],
    references: [Product.id],
  }),
}));

export const DownloadVerificationRelations = relations(
  DownloadVerification,
  ({ one }) => ({
    product: one(Product, {
      fields: [DownloadVerification.productId],
      references: [Product.id],
    }),
  })
);
