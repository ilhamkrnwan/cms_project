import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Lock,
  Plus,
  Search,
  Shield,
  Key,
  CheckCircle2,
  Trash2,
  Edit,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { usersApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/roles")({
  component: RolesPage,
});

interface RoleItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  assignedUsersCount: number;
  type: "system" | "custom";
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: "role_admin",
    name: "Administrator",
    slug: "admin",
    description: "Full system administration & workspace management permissions.",
    permissions: ["content:create", "content:edit", "content:delete", "content:publish", "media:upload", "media:delete", "settings:manage", "users:manage"],
    assignedUsersCount: 2,
    type: "system",
  },
  {
    id: "role_editor",
    name: "Content Editor",
    slug: "editor",
    description: "Can create, edit, optimize, and publish articles across connected adapters.",
    permissions: ["content:create", "content:edit", "content:publish", "media:upload"],
    assignedUsersCount: 14,
    type: "system",
  },
  {
    id: "role_viewer",
    name: "Viewer / Reviewer",
    slug: "viewer",
    description: "Read-only access to articles, media assets, and SEO reports.",
    permissions: ["content:view", "media:view"],
    assignedUsersCount: 5,
    type: "system",
  },
  {
    id: "role_social_mgr",
    name: "Social Media Manager",
    slug: "social_manager",
    description: "Custom role for broadcasting content directly to connected social accounts.",
    permissions: ["social:publish", "content:view", "media:upload"],
    assignedUsersCount: 3,
    type: "custom",
  },
];

function RolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "system" | "custom">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Create Role Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleNameInput, setRoleNameInput] = useState("");
  const [roleDescInput, setRoleDescInput] = useState("");

  useEffect(() => {
    usersApi.roles()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: RoleItem[] = res.data.map((r: any, idx: number) => ({
            id: r.id || `role_${idx}`,
            name: r.name || "Custom Role",
            slug: r.slug || "custom_role",
            description: r.description || "Workspace permission role policy",
            permissions: r.permissions || ["content:create", "content:edit", "media:upload"],
            assignedUsersCount: r.assignedUsersCount || 0,
            type: (r.type as RoleItem["type"]) || "custom",
          }));
          setRoles(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredRoles.map((r) => r.id));
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

  const handleDeleteRole = async (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    try {
      await usersApi.deleteRole(id);
    } catch {}
    toast.add({ type: "success", title: "Role deleted successfully" });
  };

  const handleSaveRole = async () => {
    if (!roleNameInput.trim()) return;

    try {
      const res = await usersApi.createRole({
        name: roleNameInput,
        description: roleDescInput,
        permissions: ["content:create", "content:edit", "media:upload"]
      });

      if (res.success && res.data) {
        setRoles((prev) => [...prev, res.data]);
      } else {
        const newRole: RoleItem = {
          id: `role_${Date.now()}`,
          name: roleNameInput,
          slug: roleNameInput.toLowerCase().replace(/\s+/g, "_"),
          description: roleDescInput || "Custom workspace permission role",
          permissions: ["content:create", "content:edit", "media:upload"],
          assignedUsersCount: 0,
          type: "custom",
        };
        setRoles((prev) => [...prev, newRole]);
      }
    } catch {
      const newRole: RoleItem = {
        id: `role_${Date.now()}`,
        name: roleNameInput,
        slug: roleNameInput.toLowerCase().replace(/\s+/g, "_"),
        description: roleDescInput || "Custom workspace permission role",
        permissions: ["content:create", "content:edit", "media:upload"],
        assignedUsersCount: 0,
        type: "custom",
      };
      setRoles((prev) => [...prev, newRole]);
    }

    toast.add({ type: "success", title: `Role ${roleNameInput} created` });
    setRoleNameInput("");
    setRoleDescInput("");
    setIsRoleModalOpen(false);
  };

  const filteredRoles = roles.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && r.type === activeTab;
  });

  const countAll = roles.length;
  const countSystem = roles.filter((r) => r.type === "system").length;
  const countCustom = roles.filter((r) => r.type === "custom").length;

  return (
    <div data-content-padding="false" className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-background font-sans">
      {/* 1. Page Header Bar */}
      <div className="shrink-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b px-6 py-4 bg-card">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Roles & RBAC Permissions</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Configure Role-Based Access Control (RBAC) rules, scope policies, and publishing permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setIsRoleModalOpen(true)} className="rounded-md">
            <Plus className="mr-1.5 size-4" />
            Create Role
          </Button>
        </div>
      </div>

      {/* 2. Filter & Action Toolbar */}
      <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b px-6 py-3 bg-card/50">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search roles or permission scopes..."
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
            All Roles ({countAll})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "system" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            System Roles ({countSystem})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === "custom" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Custom Roles ({countCustom})
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
                  checked={selectedIds.length > 0 && selectedIds.length === filteredRoles.length}
                  onCheckedChange={(c) => handleSelectAll(Boolean(c))}
                />
              </TableHead>
              <TableHead className="font-semibold text-xs">Role Name & Identifier</TableHead>
              <TableHead className="font-semibold text-xs">Description</TableHead>
              <TableHead className="font-semibold text-xs">Permission Scopes</TableHead>
              <TableHead className="font-semibold text-xs text-center">Assigned Members</TableHead>
              <TableHead className="text-right font-semibold text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  No roles found matching search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id} className="hover:bg-muted/30 transition-colors border-b">
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(role.id)}
                      onCheckedChange={(c) => handleSelectOne(role.id, Boolean(c))}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Shield className="size-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {role.name}
                          <Badge variant={role.type === "system" ? "secondary" : "outline"} className="text-[10px] font-normal py-0">
                            {role.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">/{role.slug}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {role.description}
                  </TableCell>

                  <TableCell className="max-w-md">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px] font-mono font-normal bg-muted/80">
                          <Key className="mr-1 size-2.5 text-primary" />
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs font-normal">
                      <Users className="mr-1 size-3 text-muted-foreground" />
                      {role.assignedUsersCount} members
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Edit className="size-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                      {role.type !== "system" && (
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDeleteRole(role.id)}>
                          <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                        </Button>
                      )}
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
          Showing 1–{filteredRoles.length} of {filteredRoles.length} roles
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

      {/* Create Role Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create Custom Role</DialogTitle>
            <DialogDescription className="text-xs">
              Define a new permission scope policy for team members.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Role Name</Label>
              <Input
                placeholder="e.g. Social Media Manager"
                value={roleNameInput}
                onChange={(e) => setRoleNameInput(e.target.value)}
                className="text-xs rounded-md"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                placeholder="Role responsibilities and scope description..."
                value={roleDescInput}
                onChange={(e) => setRoleDescInput(e.target.value)}
                className="h-20 text-xs rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsRoleModalOpen(false)} className="rounded-md">
              Cancel
            </Button>
            <Button onClick={handleSaveRole} className="rounded-md">Create Role Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
