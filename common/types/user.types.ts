export type User = {
  googleId: string;
  email: string;
  name: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
  picture: string;
}
