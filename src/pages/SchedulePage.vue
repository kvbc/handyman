<template>
  <q-page class="schedule-page fit no-scroll">
    <div class="text-h5">Schedule</div>
    <!-- top bar -->
    <div class="schedule-toolbar">
      <!-- LEFT -->
      <div class="row items-center q-gutter-xs">
        <q-btn dense flat round icon="keyboard_double_arrow_left" @click="prevWeek" />
        <q-btn dense flat round icon="chevron_left" @click="prevDay" />
      </div>
      <!-- CENTER -->
      <div class="row items-center q-gutter-sm justify-center">
        <q-btn dense outline label="Today" icon="today" @click="goToday" />

        <date-field v-model="selectedDate" label="Week" />
      </div>
      <!-- RIGHT -->
      <div class="row items-center q-gutter-xs">
        <q-btn dense flat round icon="chevron_right" @click="nextDay" />
        <q-btn dense flat round icon="keyboard_double_arrow_right" @click="nextWeek" />
      </div>
    </div>

    <!-- calendar fills EVERYTHING else -->
    <div class="calendar-container">
      <div class="calendar-inner">
        <FullCalendar ref="calendarRef" :options="calendarOptions" />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.q-page {
  padding: 0 !important;
}
html,
body,
#q-app,
.q-layout,
.q-page-container {
  height: 100%;
}
.schedule-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.schedule-toolbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
}
.calendar-container {
  flex: 1 1 auto;
  position: relative;
}
.calendar-inner {
  position: absolute;
  inset: 0;
}
.fc-toolbar-title {
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import DateField from 'src/components/DateField.vue';
import plLocale from '@fullcalendar/core/locales/pl';
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, onMounted, ref, watch } from 'vue';
import { useScheduleStore } from 'src/stores/useScheduleStore';
import { useTasksStore } from 'src/stores/useTasksStore';
import type { CalendarApi } from '@fullcalendar/core';
import { date } from 'quasar';

const selectedDate = ref(new Date());
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const tasksStore = useTasksStore();
const scheduleStore = useScheduleStore();

watch(selectedDate, (d) => {
  const api: CalendarApi | undefined = calendarRef.value?.getApi();
  api?.gotoDate(d);
});

onMounted(() => {
  scheduleStore.seedTestSessions();
});

const events = computed(() =>
  scheduleStore.sessions.map((s) => ({
    id: s.id,
    title: tasksStore.getTask(s.taskId)?.name ?? '???',
    start: s.start,
    end: s.end,
  })),
);

const calendarOptions = computed(() => ({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridDay',

  height: '100%',
  expandRows: true,

  slotDuration: '00:30:00', // grid lines every 30 min
  slotLabelInterval: '00:30:00',
  locale: plLocale,

  allDaySlot: false,
  nowIndicator: true,
  editable: true,

  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const,
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const,
  titleFormat: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as const,
  headerToolbar: false as const,

  events: events.value,

  eventClick(info: unknown) {
    console.log('edit this', info);
  },
}));

function prevDay() {
  selectedDate.value = date.addToDate(selectedDate.value, { days: -1 });
}
function nextDay() {
  selectedDate.value = date.addToDate(selectedDate.value, { days: 1 });
}
function prevWeek() {
  selectedDate.value = date.addToDate(selectedDate.value, { days: -7 });
}
function nextWeek() {
  selectedDate.value = date.addToDate(selectedDate.value, { days: 7 });
}
function goToday() {
  selectedDate.value = new Date();
}
</script>
