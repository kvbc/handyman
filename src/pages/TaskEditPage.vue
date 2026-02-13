<template>
  <q-page class="flex column fit">
    <div class="q-pa-md">
      <div class="text-h5">Editing Task #{{ taskId }}</div>
      <div class="flex text-grey-8 q-mb-xs">
        <q-icon name="event_note" class="self-center q-mr-xs" />
        <div>Created {{ date.formatDate(task.creationDate, 'DD.MM.YYYY') }}</div>
      </div>
      <q-separator />
    </div>
    <div class="col scroll q-pb-xl q-mb-xl">
      <q-form
        ref="form"
        @submit="handleSubmitButtonClicked"
        @reset="handleCancelButtonClicked"
        class="q-gutter-y-md"
      >
        <div class="q-gutter-y-sm q-px-md">
          <q-input outlined v-model="name" label="Name" dense />
          <q-input outlined v-model="brief" label="Brief" dense />
          <q-input
            outlined
            dense
            type="number"
            v-model.number="priority"
            label="Priority"
            lazy-rules
            hide-bottom-space
            :rules="numberInputRules"
          />
          <date-field v-model="startDate" label="Start date" :base-date="task.creationDate" />
        </div>

        <div class="bg-blue-grey text-white row items-center">
          <div class="col" />
          <div class="col text-center text-body1 text-bold">Start</div>
          <div class="col text-right">
            <q-btn round size="sm" dense flat icon="info">
              <q-menu anchor="bottom right" self="top right">
                <div class="q-pa-sm" style="max-width: 250px">
                  Factors that determine when a session is scheduled
                </div>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <div class="q-gutter-y-sm q-px-md">
          <div class="row items-center justify-between">
            <div>Prefer timing</div>
            <q-btn-toggle
              v-model="preferTiming"
              size="sm"
              push
              glossy
              toggle-color="primary"
              :options="preferTimingOptions"
            />
          </div>
          <div class="row items-center justify-between">
            <div>Prefer session chaining</div>
            <q-toggle v-model="preferSessionChaining" dense />
          </div>
          <q-input
            outlined
            type="number"
            v-model.number="minSessionsPerDay"
            label="Min. sessions per day"
            lazy-rules
            hide-bottom-space
            dense
          />
          <q-input
            outlined
            type="number"
            v-model.number="minSessionsPerWeek"
            label="Min. sessions per week"
            lazy-rules
            hide-bottom-space
            dense
          />
          <q-input
            outlined
            type="number"
            v-model.number="minHoursPerWeek"
            label="Min. hours per week"
            lazy-rules
            hide-bottom-space
            dense
          />
          <q-input
            outlined
            type="number"
            v-model.number="minHoursBetweenSessions"
            label="Min. hours between sessions"
            lazy-rules
            hide-bottom-space
            dense
          />
          <div>
            <div
              class="bg-blue-grey-4 text-white q-mb-sm row items-center justify-center q-gutter-x-xs"
            >
              <q-icon name="account_tree" />
              <div>Task Relations</div>
            </div>
            <task-relation-list-edit v-model="taskRelations" :parent-task-id="taskId" />
          </div>
          <div>
            <div
              class="bg-blue-grey-4 text-white q-mb-sm row items-center justify-center q-gutter-x-xs"
            >
              <q-icon name="event_available" />
              <div>Allow Timestamps</div>
            </div>
            <timespan-list-edit v-model="allowTimestamps" />
          </div>
          <div>
            <div
              class="bg-blue-grey-4 text-white q-mb-sm row items-center justify-center q-gutter-x-xs"
            >
              <q-icon name="block" />
              <div>Deny Timestamps</div>
            </div>
            <timespan-list-edit v-model="denyTimestamps" />
          </div>
        </div>

        <div class="text-body1 text-bold bg-blue-grey text-white text-center">Duration</div>

        <div class="q-gutter-y-sm q-px-md">
          <div class="row items-center justify-between">
            <div>Allow session splitting</div>
            <q-toggle v-model="allowSessionSplitting" dense />
          </div>
          <q-input
            outlined
            type="number"
            v-model.number="minSessionDurationMinutes"
            label="Min. session duration (minutes)"
            lazy-rules
            dense
            hide-bottom-space
          />
          <q-input
            outlined
            type="number"
            v-model.number="maxSessionDurationMinutes"
            label="Max. session duration (minutes)"
            lazy-rules
            dense
            hide-bottom-space
          />
        </div>

        <div class="text-body1 text-bold bg-blue-grey text-white text-center">End</div>

        <div class="q-gutter-y-sm q-px-md">
          <date-field v-model="dueDate" label="Due date" :base-date="baseDateForDueDate" />
          <div class="row items-center justify-between">
            <div>Due date constraint</div>
            <q-btn-toggle
              v-model="dueDateConstraint"
              size="sm"
              push
              glossy
              toggle-color="primary"
              :options="dueDateConstraintOptions"
            />
          </div>
          <q-input
            outlined
            type="number"
            v-model.number="maxSessionsPerDay"
            label="Max. sessions per day"
            lazy-rules
            hide-bottom-space
            dense
          />
          <q-input
            outlined
            type="number"
            v-model.number="maxSessionsPerWeek"
            label="Max. sessions per week"
            lazy-rules
            hide-bottom-space
            dense
          />
          <q-input
            outlined
            type="number"
            v-model.number="maxHoursPerWeek"
            label="Max. hours per week"
            lazy-rules
            hide-bottom-space
            dense
          />
        </div>
      </q-form>
    </div>
    <q-page-sticky position="bottom" expand class="bg-grey-3 q-pa-md">
      <div class="row justify-between full-width">
        <q-btn
          color="negative"
          label="Cancel"
          no-caps
          type="reset"
          v-on:click="handleCancelButtonClicked"
        />
        <q-btn
          color="primary"
          label="Save"
          no-caps
          type="submit"
          v-on:click="handleSubmitButtonClicked"
        />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<style scoped lang="scss">
.q-page {
  padding: 0 !important;
}
</style>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { useTasksStore } from 'src/stores/useTasksStore';
import { QForm } from 'quasar';
import { date } from 'quasar';
import type { TaskRelation, Timespan } from 'src/types';
import TimespanListEdit from 'src/components/TimespanListEdit.vue';
import DateField from 'src/components/DateField.vue';
import TaskRelationListEdit from 'src/components/TaskRelationListEdit.vue';

const route = useRoute();
const router = useRouter();
const taskId = Number(route.params.id);
const tasksStore = useTasksStore();
const task = tasksStore.getTask(taskId)!;

const $q = useQuasar();
const form = ref<null | QForm>(null);
const name = ref<null | string>(null);
const brief = ref<null | string>(null);
const priority = ref<null | number>(null);
const startDate = ref<null | Date>(null);
const dueDate = ref<null | Date>(null);
const dueDateConstraint = ref<'hard' | 'soft'>('hard');
const preferTiming = ref<null | 'earlier' | 'later'>(null);
const preferSessionChaining = ref<boolean>(false);
const minSessionsPerDay = ref<number | null>(null);
const minSessionsPerWeek = ref<number | null>(null);
const minHoursPerWeek = ref<number | null>(null);
const maxSessionsPerDay = ref<number | null>(null);
const maxSessionsPerWeek = ref<number | null>(null);
const maxHoursPerWeek = ref<number | null>(null);
const minHoursBetweenSessions = ref<number | null>(null);
const allowSessionSplitting = ref<boolean>(false);
const minSessionDurationMinutes = ref<number>(15);
const maxSessionDurationMinutes = ref<number | null>(null);
const allowTimestamps = ref<Timespan[]>([]);
const denyTimestamps = ref<Timespan[]>([]);
const taskRelations = ref<TaskRelation[]>([]);

const preferTimingOptions = [
  {
    label: 'Unspecified',
    value: null,
  },
  {
    label: 'Earlier',
    value: 'earlier',
  },
  {
    label: 'Later',
    value: 'later',
  },
];

const dueDateConstraintOptions = [
  {
    label: 'Hard',
    value: 'hard',
  },
  {
    label: 'Soft',
    value: 'soft',
  },
];

const baseDateForDueDate = computed<Date | null>(() => {
  return startDate.value ?? task.creationDate ?? null;
});

const numberInputRules = [
  (val: unknown) => (val !== null && val !== '') || 'Required',
  (val: unknown) => Number.isInteger(Number(val)) || 'Please enter a whole number',
];
//
//
//

function handleSubmitButtonClicked() {
  if (!form.value?.validate()) return;

  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Saved',
  });

  // metadata
  task.name = name.value ?? '';
  task.brief = brief.value ?? '';
  task.priority = priority.value ?? 1;
  task.startDate = startDate.value ?? null;
  // start
  task.preferTiming = preferTiming.value;
  task.preferSessionChaining = preferSessionChaining.value;
  task.minSessionsPerDay = minSessionsPerDay.value;
  task.minSessionsPerWeek = minSessionsPerWeek.value;
  task.minHoursPerWeek = minHoursPerWeek.value;
  task.minHoursBetweenSessions = minHoursBetweenSessions.value;
  task.taskRelations = taskRelations.value;
  task.allowTimespans = allowTimestamps.value;
  task.denyTimespans = denyTimestamps.value;
  // duration
  task.allowSessionSplitting = allowSessionSplitting.value;
  task.minSessionDurationMinutes = minSessionDurationMinutes.value;
  task.maxSessionDurationMinutes = maxSessionDurationMinutes.value;
  // end
  task.dueDate = dueDate.value ?? null;
  task.dueDateConstraint = dueDateConstraint.value;
  task.maxSessionsPerDay = maxSessionsPerDay.value;
  task.maxSessionsPerWeek = maxSessionsPerWeek.value;
  task.maxHoursPerWeek = maxHoursPerWeek.value;

  router.back();
}

function handleCancelButtonClicked() {
  router.back();
}

onMounted(() => {
  // metadata
  name.value = task.name;
  brief.value = task.brief;
  priority.value = task.priority;
  startDate.value = task.startDate ?? null;
  // start
  preferTiming.value = task.preferTiming;
  preferSessionChaining.value = task.preferSessionChaining;
  minSessionsPerDay.value = task.minSessionsPerDay;
  minSessionsPerWeek.value = task.minSessionsPerWeek;
  minHoursBetweenSessions.value = task.minHoursBetweenSessions;
  minHoursPerWeek.value = task.minHoursPerWeek;
  taskRelations.value = task.taskRelations;
  allowTimestamps.value = task.allowTimespans;
  denyTimestamps.value = task.denyTimespans;
  // duration
  allowSessionSplitting.value = task.allowSessionSplitting;
  minSessionDurationMinutes.value = task.minSessionDurationMinutes;
  maxSessionDurationMinutes.value = task.maxSessionDurationMinutes;
  // end
  dueDate.value = task.dueDate ?? null;
  dueDateConstraint.value = task.dueDateConstraint;
  maxSessionsPerDay.value = task.maxSessionsPerDay;
  maxSessionsPerWeek.value = task.maxSessionsPerWeek;
  maxHoursPerWeek.value = task.maxHoursPerWeek;
});
</script>
