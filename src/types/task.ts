export type TaskStatus = "pending" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}
