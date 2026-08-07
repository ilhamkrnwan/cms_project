import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users as UsersIcon,
  Plus,
  Search,
  Shield,
  Mail,
  Trash2,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { usersApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/users")({
  component: UsersPage,
});

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  organization: string;
  avatar?: string;
  status: "active" | "invited" | "suspended";
  joinedDate: string;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: "usr_101",
    name: "Arham Khan",
    email: "admin@wontent.com",
    role: "admin",
    organization: "Wontent Enterprise",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    status: "active",
    joinedDate: "2026-07-01",
  },
  {
    id: "usr_102",
    name: "Budi Santoso",
    email: "budi@wontent.com",
    role: "editor",
    organization: "Wontent Enterprise",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    status: "active",
    joinedDate: "2026-07-15",
  },
  {
    id: "usr_103",
    name: "Siti Rahma",
    email: "siti@wontent.com",
    role: "editor",
    organization: "Marketing Team",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    status: "active",
    joinedDate: "2026-07-20",
  },
  {
    id: "usr_104",
    name: "Dewi Lestari",
    email: "dewi@wontent.com",
    role: "viewer",
    organization: "Design Agency",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    status: "invited",
    joinedDate: "2026-07-25",
  },
  {
    id: "usr_105",
    name: "Rizky Pratama",
    email: "rizky@wontent.com",
    role: "editor",
    organization: "Engineering",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    status: "active",
    joinedDate: "2026-07-28",
  },
];

const roleStyles: Record<UserItem["role"], { label: string; className: string }> = {
  admin: {
    label: "admin",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  editor: {
    label: "editor",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  viewer: {
    label: "viewer",
    className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "admin" | "editor" | "viewer">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Invite Modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState<UserItem["role"]>("editor");

  // Fetch API
  useEffect(() => {
    usersApi.list()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: UserItem[] = res.data.map((u: any, idx: number) => ({
            id: u.id || `usr_${idx}`,
            name: u.name || "Team Member",
            email: u.email || "user@wontent.com",
            role: (u.role as UserItem["role"]) || "editor",
            organization: u.organization || "Wontent Enterprise",
            avatar: INITIAL_USERS[idx % INITIAL_USERS.length]?.avatar,
            status: "active",
            joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : "2026-08-01",
          }));
          setUsers(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: UserItem["role"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    toast.add({ type: "success", title: `User role updated to ${newRole.toUpperCase()}` });
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    toast.add({ type: "success", title: "User removed from workspace" });
  };

  const handleInviteUser = () => {
    if (!emailInput.trim()) return;
    const newUser: UserItem = {
      id: `usr_${Date.now()}`,
      name: nameInput.trim() || emailInput.split("@")[0],
      email: emailInput,
      role: roleInput,
      organization: "Wontent Enterprise",
      status: "invited",
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    setUsers((prev) => [newUser, ...prev]);
    toast.add({ type: "success", title: `Invitation sent to ${emailInput}` });
    setNameInput("");
    setEmailInput("");
    setIsInviteOpen(false);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && u.role === activeTab;
  });

  const countAll = users.length;
  const countAdmin = users.filter((u) => u.role === "admin").length;
  const countEditor = users.filter((u) => u.role === "editor").length;
  const countViewer = users.filter((u) => u.role === "viewer").length;

  return (
    <div data-content-padding="false" className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-background font-sans">
      {/* 1. Page Header Bar */}
      <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b px-6 py-4 bg-card">
        <div>
          <div className="flex items-center gap-2">
            <UsersIcon className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Users & Team Management</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Manage organization members, workspace access, role assignments, and publishing permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsInviteOpen(true)} className="rounded-md">
            <Plus className="mr-1.5 size-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* 2. Filter & Action Toolbar */}
      <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b px-6 py-3 bg-card/50">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9 rounded-md"
            />
          </div>

          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs rounded-md">
            <SlidersHorizontal className="size-3.5" />
            Columns <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">5/5</span>
          </Button>
        </div>

        {/* Status Filter Tab Pills */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({countAll})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "admin" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admins ({countAdmin})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("editor")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "editor" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Editors ({countEditor})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("viewer")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "viewer" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Viewers ({countViewer})
          </button>
        </div>
      </div>

      {/* 3. Seamless Table Canvas (NO Card Wrapper / NO outer rounded border) */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/30 sticky top-0 z-10 border-b">
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={selectedIds.length > 0 && selectedIds.length === filteredUsers.length}
                  onCheckedChange={(c) => handleSelectAll(Boolean(c))}
                />
              </TableHead>
              <TableHead className="font-semibold text-xs">Member Name & Email</TableHead>
              <TableHead className="font-semibold text-xs">Organization</TableHead>
              <TableHead className="font-semibold text-xs">Inline Role</TableHead>
              <TableHead className="font-semibold text-xs">Status</TableHead>
              <TableHead className="font-semibold text-xs">Joined Date</TableHead>
              <TableHead className="text-right font-semibold text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                  No team members found matching search query.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors border-b">
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onCheckedChange={(c) => handleSelectOne(user.id, Boolean(c))}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-xs">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="size-9 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="size-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="size-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">
                      {user.organization}
                    </Badge>
                  </TableCell>

                  {/* Inline Role Selector Dropdown */}
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(val) => handleRoleChange(user.id, val as UserItem["role"])}
                    >
                      <SelectTrigger className={`h-7 text-xs w-28 rounded-md font-medium border-0 ${roleStyles[user.role].className}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">admin</SelectItem>
                        <SelectItem value="editor">editor</SelectItem>
                        <SelectItem value="viewer">viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs"
                      }
                    >
                      {user.status === "active" ? "Active" : "Invited"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {user.joinedDate}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Eye className="size-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 4. Table Pagination Footer */}
      <div className="shrink-0 flex items-center justify-between border-t px-6 py-3 bg-card text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select defaultValue="10">
            <SelectTrigger className="h-7 text-xs w-16 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          Showing 1–{filteredUsers.length} of {filteredUsers.length} members
        </div>

        <div className="flex items-center gap-2">
          <span>Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-7 rounded-md" disabled>
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="size-7 rounded-md" disabled>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Invite Team Member</DialogTitle>
            <DialogDescription className="text-xs">
              Send an invitation email to join Wontent Content Hub.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Member Name</Label>
              <Input
                placeholder="e.g. Alex Morgan"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="text-xs rounded-md"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input
                type="email"
                placeholder="alex@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="text-xs rounded-md"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assign Role</Label>
              <Select value={roleInput} onValueChange={(val) => setRoleInput(val as UserItem["role"])}>
                <SelectTrigger className="h-9 text-xs rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor (Create, edit & publish articles)</SelectItem>
                  <SelectItem value="admin">Admin (Full system access)</SelectItem>
                  <SelectItem value="viewer">Viewer (Read-only access)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="rounded-md">
              Cancel
            </Button>
            <Button onClick={handleInviteUser} className="rounded-md">Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
