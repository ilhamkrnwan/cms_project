import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/components/ui/toast";

export function AccountSwitcher({
  users,
}: {
  readonly users?: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar?: string;
    readonly role: string;
  }>;
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const currentUser = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.image || "",
    role: user.role || "admin",
  } : users?.[0] || {
    id: "usr_admin",
    name: "Admin User",
    email: "admin@wontent.com",
    avatar: "",
    role: "admin",
  };

  const handleLogout = async () => {
    await logout();
    toast.add({
      title: "Signed out",
      description: "You have been logged out successfully.",
    });
    navigate({ to: "/auth/login" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger nativeButton={false} render={<Avatar className="size-9 rounded-lg" />}>
        <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} />
        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <div className="flex w-full items-center gap-2 p-2">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} />
            <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{currentUser.name}</span>
            <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
