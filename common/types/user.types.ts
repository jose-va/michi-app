export type User = {
  email: string;
  name: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
}

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
}
