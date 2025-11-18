/**
 * Shopify API Service
 * Handles Shopify store integrations for artist/venue merch stores
 */

export interface ShopifyStore {
  id: string;
  name: string;
  description: string;
  url: string;
  domain: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  images: { src: string; alt?: string }[];
  variants: {
    id: string;
    title: string;
    price: string;
    available: boolean;
  }[];
  handle: string;
}

export interface ShopifyCart {
  id: string;
  items: {
    variantId: string;
    quantity: number;
    product: ShopifyProduct;
  }[];
  totalPrice: string;
}

class ShopifyService {
  /**
   * Get store details
   */
  async getStore(storeId: string): Promise<ShopifyStore> {
    // Demo implementation - replace with actual Shopify API calls
    const response = await fetch(`/api/shopify/stores/${storeId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch store: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get products from a store
   */
  async getProducts(
    storeId: string,
    options?: {
      limit?: number;
      category?: string;
      sortBy?: 'price' | 'title' | 'created';
    }
  ): Promise<ShopifyProduct[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.category) params.append('category', options.category);
    if (options?.sortBy) params.append('sortBy', options.sortBy);

    const response = await fetch(
      `/api/shopify/stores/${storeId}/products?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get single product details
   */
  async getProduct(storeId: string, productId: string): Promise<ShopifyProduct> {
    const response = await fetch(
      `/api/shopify/stores/${storeId}/products/${productId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get embed code for Shopify store
   */
  getEmbedCode(storeId: string, options?: { layout?: 'grid' | 'list'; productsPerPage?: number }): string {
    const layout = options?.layout || 'grid';
    const perPage = options?.productsPerPage || 12;
    
    return `<div id="shopify-embed-${storeId}" data-layout="${layout}" data-per-page="${perPage}"></div>`;
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
    const response = await fetch('/api/shopify/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, variantId, quantity }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user's cart
   */
  async getCart(userId: string): Promise<ShopifyCart> {
    const response = await fetch(`/api/shopify/cart/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Sync cart across GVTEWAY and Shopify
   */
  async syncCart(userId: string, items: { variantId: string; quantity: number }[]): Promise<ShopifyCart> {
    const response = await fetch('/api/shopify/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, items }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync cart: ${response.statusText}`);
    }

    return response.json();
  }
}

export const shopifyService = new ShopifyService();
