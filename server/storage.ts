import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  // Allow running the dev server without a database configured.
  // In production the DATABASE_URL must be set, but during local development
  // we skip initializing the Neon client to avoid startup crashes.
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL environment variable is not set");
  }
}

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL!) : undefined as any;
export const db = drizzle({ client: sql, schema });

// Export tables for easy access
export {
  users,
  suppliers,
  categories,
  brands,
  products,
  orders,
  orderItems,
  cart,
  favorites,
  reviews,
  clinics,
  subscriptionPlans,
  clinicPayments,
  mapSettings,
} from "../shared/schema";
