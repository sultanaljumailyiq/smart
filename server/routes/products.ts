import { Request, Response } from "express";
import { db, products, suppliers, categories, brands } from "../storage";
import { eq, desc, like, and, gte, lte, sql, or } from "drizzle-orm";

// Get all products with filters
export async function getProducts(req: Request, res: Response) {
  try {
    const {
      category,
      supplier,
      brand,
      search,
      minPrice,
      maxPrice,
      featured,
      new: isNew,
      limit = 20,
      offset = 0,
    } = req.query;

    let query = db.select().from(products).$dynamic();

    // Apply filters
    const conditions = [];
    
    if (category) {
      conditions.push(eq(products.categoryId, Number(category)));
    }
    
    if (supplier) {
      conditions.push(eq(products.supplierId, Number(supplier)));
    }
    
    if (brand) {
      conditions.push(eq(products.brandId, Number(brand)));
    }
    
    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.arabicName, `%${search}%`)
        )
      );
    }
    
    if (minPrice) {
      conditions.push(gte(products.price, minPrice.toString()));
    }
    
    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }
    
    if (featured === 'true') {
      conditions.push(eq(products.isFeatured, true));
    }
    
    if (isNew === 'true') {
      conditions.push(eq(products.isNew, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query
      .orderBy(desc(products.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    res.json({ products: result, count: result.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// Get product by ID
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const product = await db.query.products.findFirst({
      where: eq(products.id, Number(id)),
      with: {
        supplier: true,
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Increment view count
    await db.update(products)
      .set({ viewCount: sql`${products.viewCount} + 1` })
      .where(eq(products.id, Number(id)));

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

// Create product (Supplier only)
export async function createProduct(req: Request, res: Response) {
  try {
    const productData = req.body;
    
    // In a real app, get supplierId from authenticated user
    // For now, we'll use the supplierId from the request
    
    const [newProduct] = await db.insert(products)
      .values({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// Update product (Supplier only)
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const [updatedProduct] = await db.update(products)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(products.id, Number(id)))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// Delete product (Supplier only)
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    await db.delete(products).where(eq(products.id, Number(id)));
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
}

// Get products by supplier
export async function getProductsBySupplier(req: Request, res: Response) {
  try {
    const { supplierId } = req.params;
    
    const result = await db.select()
      .from(products)
      .where(eq(products.supplierId, Number(supplierId)))
      .orderBy(desc(products.createdAt));

    res.json({ products: result, count: result.length });
  } catch (error) {
    console.error("Error fetching supplier products:", error);
    res.status(500).json({ error: "Failed to fetch supplier products" });
  }
}
