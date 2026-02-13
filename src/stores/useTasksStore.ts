import type { Task } from 'src/types';
import { defineStore } from 'pinia';

interface State {
  tasks: Task[];
  tasksEverCreated: number;
}

interface Actions {
  getTask: (id: number) => Task | null;
  createTask: () => number;
  // updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
}

export const useTasksStore = defineStore<'tasks', State, {}, Actions>('tasks', {
  persist: true,
  state: () => ({
    tasks: [],
    tasksEverCreated: 0,
  }),
  actions: {
    getTask(id) {
      return this.tasks.find((task) => task.id === id) ?? null;
    },
    // updateTask(task) {
    //   const index = this.tasks.findIndex((fTask) => fTask.id === task.id);
    //   if (index !== -1) {
    //     this.tasks[index] = { ...this.tasks[index], ...task };
    //   }
    // },
    createTask() {
      const id = ++this.tasksEverCreated;
      const task: Task = {
        id,
        // metadata
        name: '',
        brief: '',
        priority: 1,
        startDate: new Date(),
        creationDate: new Date(),
        completionDate: null,
        completedHoursTotal: 0,
        // when start
        preferTiming: null,
        preferSessionChaining: false,
        minSessionsPerDay: null,
        minSessionsPerWeek: null,
        minHoursPerWeek: null,
        minHoursBetweenSessions: null,
        taskRelations: [],
        allowTimespans: [],
        denyTimespans: [],
        // how long
        allowSessionSplitting: false,
        minSessionDurationMinutes: 10,
        maxSessionDurationMinutes: null,
        // when end
        dueDate: null,
        dueDateConstraint: 'hard',
        maxSessionsPerDay: null,
        maxSessionsPerWeek: null,
        maxHoursPerWeek: null,
      };
      this.tasks.push(task);
      return id;
    },
    deleteTask(id) {
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        this.tasks.splice(index, 1); // most common & performant way
      }
    },
  },
});
