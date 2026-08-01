import {
  Calendar,
  FileText,
  FolderTree,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  Search,
  Settings,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import type { FileRoutesByTo } from "@/routeTree.gen";

export type NavBadge = "new" | "soon";
export type AppPath = keyof FileRoutesByTo;

export interface NavSubItem {
  id: string;
  title: string;
  url: AppPath;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: AppPath;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        id: "overview",
        title: "Dashboard Overview",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        id: "analytics",
        title: "Content Analytics",
        url: "/dashboard/analytics",
        icon: Zap,
      },
    ],
  },
  {
    id: 2,
    label: "Content Management",
    items: [
      {
        id: "contents",
        title: "Articles & Content",
        url: "/dashboard/tasks",
        icon: FileText,
      },
      {
        id: "categories",
        title: "Categories & Tags",
        url: "/dashboard/kanban",
        icon: FolderTree,
      },
      {
        id: "media",
        title: "Media Library",
        url: "/dashboard/coming-soon",
        icon: ImageIcon,
      },
    ],
  },
  {
    id: 3,
    label: "Distribution & Adapters",
    items: [
      {
        id: "adapters",
        title: "Platform Adapters",
        url: "/dashboard/infrastructure",
        icon: Globe,
      },
      {
        id: "social",
        title: "Social Channels",
        url: "/dashboard/coming-soon",
        icon: Share2,
      },
      {
        id: "calendar",
        title: "Content Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
    ],
  },
  {
    id: 4,
    label: "AI & Optimization",
    items: [
      {
        id: "seo",
        title: "SEO Engine",
        url: "/dashboard/coming-soon",
        icon: Search,
      },
      {
        id: "geo",
        title: "GEO Engine",
        url: "/dashboard/coming-soon",
        icon: Sparkles,
        badge: "new",
      },
    ],
  },
  {
    id: 5,
    label: "Administration",
    items: [
      {
        id: "users",
        title: "Users & Team",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "roles",
        title: "Roles & Permissions",
        url: "/dashboard/roles",
        icon: Lock,
      },
      {
        id: "settings",
        title: "Settings",
        url: "/dashboard/coming-soon",
        icon: Settings,
      },
    ],
  },
];
