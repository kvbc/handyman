import type { ScheduledSession } from 'src/types';
import { defineStore } from 'pinia';
import { date } from 'quasar';

interface State {
  sessions: ScheduledSession[];
}

interface Getters extends Record<string, (state: State) => unknown> {
  sessionsForDay: (state: State) => (day: Date) => ScheduledSession[];
  sessionsForWeek: (state: State) => (weekStart: Date) => ScheduledSession[];
  sessionsForSlot: (state: State) => (slotStart: Date, slotEnd: Date) => ScheduledSession[];
}

interface Actions {
  addSession: (session: ScheduledSession) => void;
  updateSession: (session: ScheduledSession) => void;
  deleteSession: (id: string) => void;
  clearGenerated: (rangeStart: Date, rangeEnd: Date) => void;
  seedTestSessions: () => void;
}

export const useScheduleStore = defineStore<'schedule', State, Getters, Actions>('schedule', {
  persist: true,
  state: () => ({ sessions: [] }),
  getters: {
    sessionsForDay: (state) => (day) => {
      return state.sessions.filter((s) => date.isSameDate(s.start, day, 'day'));
    },
    sessionsForWeek: (state) => (weekStart: Date) => {
      const weekEnd = date.addToDate(weekStart, { days: 7 });

      return state.sessions.filter((s) => s.start >= weekStart && s.start < weekEnd);
    },
    sessionsForSlot: (state) => (slotStart: Date, slotEnd: Date) => {
      return state.sessions.filter((s) => s.start < slotEnd && s.end > slotStart);
    },
  },
  actions: {
    addSession(session: ScheduledSession) {
      this.sessions.push(session);
    },
    updateSession(session: ScheduledSession) {
      const i = this.sessions.findIndex((s) => s.id === session.id);
      if (i !== -1) this.sessions[i] = session;
    },

    deleteSession(id: string) {
      this.sessions = this.sessions.filter((s) => s.id !== id);
    },

    clearGenerated(rangeStart: Date, rangeEnd: Date) {
      this.sessions = this.sessions.filter(
        (s) => s.locked || s.start < rangeStart || s.start > rangeEnd,
      );
    },
    seedTestSessions() {
      this.sessions = [
        {
          id: '1',
          taskId: 9,
          start: new Date('2026-02-18T08:00:00'),
          end: new Date('2026-02-18T09:00:00'),
          locked: false,
          generated: true,
        },
        {
          id: '2',
          taskId: 10,
          start: new Date('2026-02-18T09:30:00'),
          end: new Date('2026-02-18T10:00:00'),
          locked: false,
          generated: true,
        },
        {
          id: '3',
          taskId: 11,
          start: new Date('2026-02-19T14:00:00'),
          end: new Date('2026-02-19T16:00:00'),
          locked: false,
          generated: true,
        },
      ];
    },
  },
});
