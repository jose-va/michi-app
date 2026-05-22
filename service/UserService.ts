import { cookies } from "next/headers";

export class UserService {
  private static backendUrl = process.env.BACKEND_URL;

  static async getProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const response = await fetch(`${this.backendUrl}/auth`, {
      headers: { Cookie: `token=${token}` },
    });
    return response.ok ? response.json() : null;
  }
}
