import type { User } from "@/common/types/user.types";
import { getProfileInitial } from "@/common/utils/profile-header";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/avatar";

export default function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Avatar className="size-12">
        {user.picture.trim() !== "" ? (
          <AvatarImage
            src={user.picture}
            alt={`Foto de perfil de ${user.name}`}
          />
        ) : null}
        <AvatarFallback>{getProfileInitial(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{user.name}</p>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
