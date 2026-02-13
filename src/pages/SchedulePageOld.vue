<!-- <template>
  <q-page>
    <div class="text-h5">Schedule</div>
    <schedule-calendar />
  </q-page>
</template>

<style scoped lang="scss">
.q-page {
  padding: 0 !important;
}
</style>

<script setup lang="ts">
// import { date } from 'quasar';
import ScheduleCalendar from 'src/components/ScheduleCalendar.vue';
import { useScheduleStore } from 'src/stores/useScheduleStore';
import { onMounted } from 'vue';

const scheduleStore = useScheduleStore();
// const selectedDate = ref<Date>(new Date());
// const weekStart = computed(() => startOfWeek(selectedDate.value));
// const weekDays = computed(() => getWeekDays(weekStart.value));
// const selectedDayIndex = ref(getTodayIndex(weekStart.value));
// const selectedDay = computed(() => weekDays.value[selectedDayIndex.value]!);
// const sessionsForSelectedDay = computed(() => scheduleStore.sessionsForDay(selectedDay.value));

onMounted(() => {
  scheduleStore.seedTestSessions();
});

// function startOfWeek(d: Date) {
//   const day = date.getDayOfWeek(d); // 0 = Sunday ... 6 = Saturday
//   const diff = day === 0 ? -6 : 1 - day; // shift to Monday
//   return date.addToDate(date.startOfDate(d, 'day'), { days: diff });
// }

// function getWeekDays(weekStart: Date) {
//   return Array.from({ length: 7 }, (_, i) => date.addToDate(weekStart, { days: i }));
// }

// function getTodayIndex(weekStart: Date) {
//   const today = new Date();

//   const diff = date.getDateDiff(
//     date.startOfDate(today, 'day'),
//     date.startOfDate(weekStart, 'day'),
//     'days',
//   );

//   return diff >= 0 && diff < 7 ? diff : 0;
// }

// function nextWeek() {
//   selectedDate.value = date.addToDate(selectedDate.value, { days: 7 });
// }

// function prevWeek() {
//   selectedDate.value = date.addToDate(selectedDate.value, { days: -7 });
// }

// export function generateDaySlots(intervalMinutes = 30) {
//   const slots: string[] = []
//   for (let h = 0; h < 24; h++) {
//     for (let m = 0; m < 60; m += intervalMinutes) {
//       slots.push(
//         `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
//       )
//     }
//   }
//   return slots
// }
</script> -->
