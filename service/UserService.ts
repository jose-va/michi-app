import { cookies } from "next/headers";

type GetProfileOverrides = {
  token?: string;
  fetcher?: typeof fetch;
};

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

  static async getProfile(overrides?: GetProfileOverrides) {
    const token = overrides
      ? overrides.token
      : (await cookies()).get("token")?.value;

    if (!token) return null;

    const fetcher = overrides?.fetcher ?? fetch;
    const headers: HeadersInit = overrides
      ? { "Content-Type": "application/json", Cookie: `token=${token}` }
      : await this.authHeader();

    let response: Response;
    try {
      response = await fetcher(`${this.backendUrl}/auth/user`, { headers });
    } catch {
      return null;
    }

    if (response.status === 401) return null;

    if (!response.ok) {
      console.warn(
        `No se ha podido obtener el perfil del usuario (estado ${response.status})`
      );
      return null;
    }

    try {
      const data = await response.json();
      return data;
    } catch {
      console.warn("No se ha podido obtener el perfil del usuario");
      return null;
    }
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
