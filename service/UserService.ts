import { cookies } from "next/headers";

export class UserService {
  private static backendUrl = process.env.BACKEND_URL;
  private static async authHeader(): Promise<HeadersInit> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return {
      "Content-Type": "application/json",
      ...(token && { Cookie: `token=${token}` }),
    };
  }

  static async getProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const response = await fetch(`${this.backendUrl}/auth/user`, {
      headers: await this.authHeader(),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  }

  static async markFavorite(user: string, product: string): Promise<boolean> {
    const url = `${this.backendUrl}/auth/user/${user}?productId=${product}`;
    const headers = await this.authHeader();

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      redirect: "manual",
    });

    if (!response.ok) throw new Error("No se ha podido marcar como favorito");
    return true;
  }

  static async unmarkFavorite(user: string, product: string): Promise<boolean> {
    const response = await fetch(
      `${this.backendUrl}/auth/user/${user}?productId=${product}`,
      {
        method: "DELETE",
        headers: await this.authHeader(),
      }
    );

    if (!response.ok)
      throw new Error("No se ha podido desmarcar como favorito");
    return true;
  }
}
