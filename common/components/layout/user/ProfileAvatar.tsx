import { User } from "@/common/types/user.types";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/avatar";

import { Crown } from "lucide-react";

export default function ProfileAvatar({ user }: { user: User }) {
  return (
    <Avatar className="hover:scale-105 hover:cursor-pointer">
      <AvatarImage src={user.picture} alt={`Foto de perfil de ${user.name}`} />
      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
      {user.role === "ROLE_USER" ? (
        <AvatarBadge className="bg-green-600" />
      ) : (
        <AvatarBadge
          title="Administrador"
          aria-label="Administrador"
          className="size-3! bg-yellow-400 text-zinc-900 ring-2 ring-background"
        >
          <Crown className="size-2!" strokeWidth={3} />
        </AvatarBadge>
      )}
    </Avatar>
  );
}
