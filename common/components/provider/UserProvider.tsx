"use client";
import { User } from "@/common/types/user.types";
import { createContext, useContext, useState } from "react";

const UserContext = createContext<User | null>(null);

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user] = useState<User | null>(initialUser);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
