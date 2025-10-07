import express from "express";
import cors from "cors";
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

  // Lazily import route handlers to avoid pulling in storage/database
  // modules during Vite config bundling or other startup flows where
  // DATABASE_URL may not be set.
  (async () => {
    const { handleDemo } = await import("./routes/demo");
    const productsController = await import("./routes/products");
    const cartController = await import("./routes/cart");
    const ordersController = await import("./routes/orders");
    const clinicsController = await import("./routes/clinics");

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
  })().catch((err) => {
    // If route initialization fails (e.g., missing DB), log but keep server running
    // so the frontend dev server can start. API routes depending on DB will error
    // when called.
    // eslint-disable-next-line no-console
    console.warn("Failed to initialize API routes:", err?.message || err);
  });

  // For unmatched routes: pass non-API to next (Vite/static), 404 JSON for unknown API
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    next();
  });

  return app;
}
