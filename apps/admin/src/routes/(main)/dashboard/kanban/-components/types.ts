export type ColumnId = "drafts" | "editorial_review" | "scheduled" | "published";

export type Column = {
  id: ColumnId;
  title: string;
};

export type TaskTeam =
  | "Backend"
  | "Data"
  | "Design"
  | "Docs"
  | "Finance Ops"
  | "Platform"
  | "Product"
  | "QA"
  | "Security";

export type TaskPriority = "High" | "Medium" | "Low";

export type TaskInsightLabel =
  | "Attachments"
  | "Comments"
  | "Documents"
  | "SEO Score"
  | "GEO Score"
  | "Adapters"
  | "Views";

export type TaskInsight = {
  label: TaskInsightLabel;
  count: number;
};

export type TaskOwnerProfile = {
  name: string;
  tone: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  progress: number;
  owner: TaskOwnerProfile;
  team: TaskTeam;
  insights: TaskInsight[];
};

export type BoardState = Record<ColumnId, Task[]>;
