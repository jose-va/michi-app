import { User } from "@/common/types/user.types";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/avatar";

import { Swords } from "lucide-react";

export default function ProfileAvatar({ user }: { user: User }) {
  return (
    <Avatar className="hover:scale-110 hover:cursor-pointer">
      <AvatarImage src={user.picture} alt="michi-user" />
      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
      {user.role === "ROLE_USER" ? (
        <AvatarBadge className="animate-bounce bg-green-600" />
      ) : (
        <AvatarBadge className="10! size-4! bg-transparent text-yellow-500 ring-transparent">
          <Swords className="size-4!" />
        </AvatarBadge>
      )}
    </Avatar>
  );
}
