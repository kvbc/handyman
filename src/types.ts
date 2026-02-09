export interface DateRange {
  startDate: Date;
  startDateRepeatDays: number;
  endDate: Date;
  endDateRepeatDays: number;
  priority: number;
}

export interface Task {
  id: number;
  name: string;
  brief: string;
  priority: number;

  creationDate: Date;
  dueDate: Date | null;

  allowedDateRanges: DateRange[];
  blockedDateRanges: DateRange[];

  repeatDays: number;
  repeatPerWeek: number;
}
