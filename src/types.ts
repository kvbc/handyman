export interface TaskBound {
  id: string;
  position: 'before' | 'after';
  adjacent: boolean; // right before or right after
  parentTaskId: number;
  childTaskIds: number[];
  priority: number;
}

export interface Timespan {
  id: string;
  rrText: string;
  startHour: number;
  endHour: number;
}

export interface Task {
  id: number;

  // metadata
  name: string;
  brief: string;
  priority: number;
  creationDate: Date;
  completionDate: Date | null;
  completedHoursTotal: number;

  // when to start it
  preferTiming: 'earlier' | 'later' | null;
  preferSessionChaining: boolean;
  minSessionsPerDay: number | null;
  minSessionsPerWeek: number | null;
  minHoursPerWeek: number | null;
  taskBounds: TaskBound[];
  allowTimespans: Timespan[];
  preferTimespans: Timespan[];
  avoidTimespans: Timespan[];
  blockTimespans: Timespan[];

  // for how long
  allowSessionSplitting: boolean;
  minSessionDurationMinutes: number;
  maxSessionDurationMinutes: number | null;

  // when to end it
  dueDate: Date | null;
  maxSessionsPerDay: number | null;
  maxSessionsPerWeek: number | null;
  maxHoursPerWeek: number | null;
}
