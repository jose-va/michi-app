export type User = {
  id: string;
  email: string;
  name: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
  picture: string;
  favoriteProducts: string[]
}
