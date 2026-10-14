import { pgTable, text, varchar, integer, boolean, timestamp, uuid, jsonb, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 30 }).notNull().default("karyawan"), // 'pemilik' | 'karyawan'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(), // WhatsApp format
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const catalogItems = pgTable("catalog_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'kemeja' | 'jas' | 'gamis' | 'celana' | 'kaos_seragam'
  basePrice: integer("base_price").notNull(),
  description: text("description"),
  measurementFields: jsonb("measurement_fields").$type<string[]>().notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  spkNumber: varchar("spk_number", { length: 50 }).notNull().unique(),
  customerId: uuid("customer_id")
    .references(() => customers.id, { onDelete: "cascade" })
    .notNull(),
  statusPayment: varchar("status_payment", { length: 30 }).notNull().default("unpaid"), // 'unpaid' | 'dp' | 'paid'
  totalPrice: integer("total_price").notNull(),
  downPayment: integer("down_payment").default(0).notNull(),
  deadline: date("deadline").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  catalogItemId: uuid("catalog_item_id").references(() => catalogItems.id, { onDelete: "set null" }),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  fabricType: varchar("fabric_type", { length: 150 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: integer("unit_price").notNull(),
  measurements: jsonb("measurements").$type<Record<string, number | string>>().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productionStages = pgTable("production_stages", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderItemId: uuid("order_item_id")
    .references(() => orderItems.id, { onDelete: "cascade" })
    .notNull(),
  stage: varchar("stage", { length: 50 }).notNull(), // 'cutting' | 'sewing' | 'qc' | 'packing' | 'ready'
  status: varchar("status", { length: 30 }).notNull().default("pending"), // 'pending' | 'in_progress' | 'completed'
  sequence: integer("sequence").notNull(),
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  operatorName: varchar("operator_name", { length: 255 }),
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assignedStages: many(productionStages),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  catalogItem: one(catalogItems, {
    fields: [orderItems.catalogItemId],
    references: [catalogItems.id],
  }),
  stages: many(productionStages),
}));

export const productionStagesRelations = relations(productionStages, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [productionStages.orderItemId],
    references: [orderItems.id],
  }),
  assignedUser: one(users, {
    fields: [productionStages.assignedTo],
    references: [users.id],
  }),
}));
