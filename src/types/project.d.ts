export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done' | 'backlog';
}
