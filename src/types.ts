export interface TaskRelation {
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
  constraint: 'hard' | 'soft';
}

export interface Task {
  id: number;

  // metadata
  name: string;
  brief: string;
  priority: number;
  startDate: Date | null;
  creationDate: Date;
  completionDate: Date | null;
  completedHoursTotal: number;
  // TODO status taska
  // TODO timezone

  // when to start it
  preferTiming: 'earlier' | 'later' | null;
  preferSessionChaining: boolean;
  minSessionsPerDay: number | null;
  minSessionsPerWeek: number | null;
  minHoursPerWeek: number | null;
  minHoursBetweenSessions: number | null;
  taskRelations: TaskRelation[];
  allowTimespans: Timespan[];
  denyTimespans: Timespan[];

  // for how long
  allowSessionSplitting: boolean;
  minSessionDurationMinutes: number;
  maxSessionDurationMinutes: number | null;

  // when to end it
  dueDate: Date | null;
  dueDateConstraint: 'hard' | 'soft';
  maxSessionsPerDay: number | null;
  maxSessionsPerWeek: number | null;
  maxHoursPerWeek: number | null;
}

/*
 *
 * Schedule
 *
 */

export interface ScheduledSession {
  id: string;
  taskId: number;
  start: Date;
  end: Date;
  generated: boolean;
  locked: boolean;
  notificationId?: string | null;
}
