import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as productsController from "./routes/products";
import * as cartController from "./routes/cart";
import * as ordersController from "./routes/orders";
import * as clinicsController from "./routes/clinics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Product routes
  app.get("/api/products", productsController.getProducts);
  app.get("/api/products/:id", productsController.getProductById);
  app.post("/api/products", productsController.createProduct);
  app.put("/api/products/:id", productsController.updateProduct);
  app.delete("/api/products/:id", productsController.deleteProduct);
  app.get("/api/suppliers/:supplierId/products", productsController.getProductsBySupplier);

  // Cart routes
  app.get("/api/cart/:userId", cartController.getCart);
  app.post("/api/cart", cartController.addToCart);
  app.put("/api/cart/:id", cartController.updateCartItem);
  app.delete("/api/cart/:id", cartController.removeFromCart);
  app.delete("/api/cart/:userId/clear", cartController.clearCart);

  // Order routes
  app.get("/api/orders/:userId", ordersController.getOrders);
  app.get("/api/suppliers/:supplierId/orders", ordersController.getSupplierOrders);
  app.get("/api/order/:id", ordersController.getOrderById);
  app.post("/api/orders", ordersController.createOrder);
  app.put("/api/orders/:id/status", ordersController.updateOrderStatus);
  app.put("/api/order-items/:id/status", ordersController.updateOrderItemStatus);

  // Clinic routes
  app.get("/api/clinics", clinicsController.getClinics);
  app.get("/api/clinics/nearby", clinicsController.getNearbyClinics);
  app.get("/api/clinics/:id", clinicsController.getClinicById);
  app.get("/api/clinics/governorate/:governorate", clinicsController.getClinicsByGovernorate);
  app.post("/api/clinics/seed", clinicsController.seedClinics); // Development only

  // For unmatched routes: pass non-API to next (Vite/static), 404 JSON for unknown API
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    next();
  });

  return app;
}
