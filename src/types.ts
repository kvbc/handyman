export interface TaskBound {
  position: 'before' | 'after';
  adjacent: boolean; // right before or right after
  taskIds: number[];
  priority: number;
}

export interface Task {
  id: number;
  name: string;
  brief: string;
  priority: number;
  timezone: string;

  creationDate: Date;
  completionDate: Date | null;
  completedHoursTotal: number;

  // when to start it
  taskBounds: TaskBound[];
  preferEarlierSessions?: boolean; // or later
  preferChainingSessions?: boolean;
  allowSessionSplitting?: boolean;
  allowDatesRRText: string;
  preferredDatesRRText: string;
  avoidDatesRRText: string;
  blockDatesRRText: string;
  maxSessionsPerDay: number;
  minSessionsPerWeek: number;
  minHoursPerWeek: number;

  // for how long
  minSessionDurationMinutes: number;
  maxSessionDurationMinutes: number;

  // when to end it
  dueDate: Date | null;
  maxSessionsPerWeek: number;
  maxHoursPerWeek: number;
}
