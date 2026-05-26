import { ProductFormValues } from "@/common/types/product-form.types";
import { Product, Page } from "@/common/types/product.types";
import { cookies } from "next/headers";

export class ProductService {
  private static baseUrl = process.env.BACKEND_URL;
  private static async authHeader(): Promise<HeadersInit> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return {
      "Content-Type": "application/json",
      ...(token && { Cookie: `token=${token}` }),
    };
  }

  static async all(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/all`, {
        method: "GET",
      });

      if (!response.ok) throw new Error(`${response.status}`);
      return response.json();
    } catch (error) {
      console.error("No se encontraron productos: " + error);
      return [];
    }
  }

  static async getProduct(id: string): Promise<Product | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error(`${response.status}`);
      return response.json();
    } catch (error) {
      console.error(`No se ha encontrado al producto ${id}:`, error);
      return undefined;
    }
  }

  static async getProducts(page: number): Promise<Page<Product> | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/products?page=${page}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error(`${response.status}`);
      return response.json();
    } catch (error) {
      console.error("No se encontraron productos: " + error);
      return undefined;
    }
  }

  static async searchProducts(params?: {
    name?: string;
    category?: string;
    allergens?: string[];
  }): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();

      if (params?.name) searchParams.set("name", params.name);
      if (params?.category) searchParams.set("category", params.category);
      if (params?.allergens) {
        params.allergens.forEach((a) => searchParams.append("allergens", a));
      }

      const url = `${this.baseUrl}/products/search?${searchParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error en la búsqueda de productos:", error);
      return [];
    }
  }

  static async create(data: ProductFormValues): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: "POST",
      headers: await this.authHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("No se ha podido crear el producto");
    return await response.json();
  }

  static async update(id: string, product: Product): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "PUT",
      headers: await this.authHeader(),
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("No se ha podido actualizar el producto");
    return response.json();
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: "DELETE",
      headers: await this.authHeader(),
    });

    if (!response.ok) throw new Error("No se ha podido eliminar el producto");
  }

  static async deactivate(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}/deactivate`, {
      method: "PATCH",
      headers: await this.authHeader(),
    });

    if (!response.ok) throw new Error("No se ha podido desactivar el producto");
    return response.json();
  }

  static async activate(id: string): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/products/${id}/activate`, {
      method: "PATCH",
      headers: await this.authHeader(),
    });

    if (!response.ok) throw new Error("No se ha podido activar el producto");
    return response.json();
  }

  static async activateAll(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`, {
      method: "PATCH",
      headers: await this.authHeader(),
    });

    if (!response.ok) throw new Error("No se han podido activar los productos");
    return response.json();
  }

  static async sync(): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/products/uber`, {
      method: "POST",
      headers: await this.authHeader(),
    });

    if (!response.ok)
      throw new Error("No se ha podido sincronizar con Uber Eats");
    return true;
  }
}
