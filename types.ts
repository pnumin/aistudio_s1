export interface Course {
  id: string;
  name: string;
  hours: number;
  prerequisiteId?: string | null;
}