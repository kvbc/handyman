<template>
  <q-page class="flex column">
    <div class="q-pa-md">
      <div class="text-h5">Editing Task #{{ taskId }}</div>
      <div class="flex text-grey-8 q-mb-xs">
        <q-icon name="alarm" class="self-center q-mr-xs" />
        <div>Created {{ date.formatDate(task.creationDate, 'DD.MM.YYYY') }}</div>
      </div>
      <q-separator />
    </div>
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
        <div>
          <div
            class="bg-blue-grey-4 text-white q-mb-sm row items-center justify-center q-gutter-x-xs"
          >
            <q-icon name="account_tree" />
            <div>Task Bounds</div>
          </div>
          <task-bound-list-edit v-model="taskBounds" :parent-task-id="taskId" />
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
            <q-icon name="star" />
            <div>Prefer Timestamps</div>
          </div>
          <timespan-list-edit v-model="preferTimestamps" />
        </div>
        <div>
          <div
            class="bg-blue-grey-4 text-white q-mb-sm row items-center justify-center q-gutter-x-xs"
          >
            <q-icon name="warning_amber" />
            <div>Avoid Timestamps</div>
          </div>
          <timespan-list-edit v-model="avoidTimestamps" />
        </div>
        <div>
          <div
            class="bg-blue-grey-4 text-white q-mb-sm row items-center justify-center q-gutter-x-xs"
          >
            <q-icon name="block" />
            <div>Block Timestamps</div>
          </div>
          <timespan-list-edit v-model="blockTimestamps" />
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
        <q-input
          outlined
          v-model="dueDateInput"
          label="Due date"
          mask="##.##.####"
          hide-bottom-space
          :rules="[validateDueDate]"
          @blur="syncInputToDate"
          dense
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover>
                <q-date v-model="dueDate" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <div class="flex items-center text-caption text-grey-7 q-mt-none bg-grey-3">
          <q-input
            class="col"
            dense
            outlined
            type="number"
            v-model.number="daysFromCreation"
            label="Set due days"
          />

          <div v-if="helperPreviewDate && daysFromCreation" class="q-ml-sm">
            → {{ date.formatDate(helperPreviewDate, 'DD.MM.YYYY') }}
            <q-btn
              flat
              dense
              icon="check"
              @click="applyDaysFromCreation"
              :disable="!helperPreviewDate"
            />
          </div>
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
    <div class="flex justify-between q-pa-md q-mt-md bg-grey-3">
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
import { onMounted, ref, watch } from 'vue';
import { useTasksStore } from 'src/stores/tasks';
import { QForm } from 'quasar';
import { date } from 'quasar';
import type { TaskBound, Timespan } from 'src/types';
import TimespanListEdit from 'src/components/TimespanListEdit.vue';
import TaskBoundListEdit from 'src/components/TaskBoundListEdit.vue';

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
const dueDate = ref<null | string>(null);
const preferTiming = ref<null | 'earlier' | 'later'>(null);
const preferSessionChaining = ref<boolean>(false);
const minSessionsPerDay = ref<number | null>(null);
const minSessionsPerWeek = ref<number | null>(null);
const minHoursPerWeek = ref<number | null>(null);
const maxSessionsPerDay = ref<number | null>(null);
const maxSessionsPerWeek = ref<number | null>(null);
const maxHoursPerWeek = ref<number | null>(null);
const allowSessionSplitting = ref<boolean>(false);
const minSessionDurationMinutes = ref<number>(15);
const maxSessionDurationMinutes = ref<number | null>(null);
const allowTimestamps = ref<Timespan[]>([]);
const preferTimestamps = ref<Timespan[]>([]);
const avoidTimestamps = ref<Timespan[]>([]);
const blockTimestamps = ref<Timespan[]>([]);
const taskBounds = ref<TaskBound[]>([]);

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

const numberInputRules = [
  (val: unknown) => (val !== null && val !== '') || 'Required',
  (val: unknown) => Number.isInteger(Number(val)) || 'Please enter a whole number',
];

//
//
//

const dueDateInput = ref<string>('');
function syncDateToInput() {
  dueDateInput.value = dueDate.value ? date.formatDate(dueDate.value, 'DD.MM.YYYY') : '';
}
watch(dueDate, (val) => {
  if (!val) {
    dueDateInput.value = '';
    return;
  }

  const parsed = date.extractDate(val, 'YYYY-MM-DD');
  if (parsed) {
    dueDateInput.value = date.formatDate(parsed, 'DD.MM.YYYY');
  }
});
function syncInputToDate() {
  if (!dueDateInput.value) {
    dueDate.value = null;
    return;
  }

  const parsed = date.extractDate(dueDateInput.value, 'DD.MM.YYYY');

  if (parsed) {
    dueDate.value = date.formatDate(parsed, 'YYYY-MM-DD');
  }
}
function validateDueDate(val: string) {
  if (!val) return 'Required';
  return !!date.extractDate(val, 'DD.MM.YYYY') || 'Invalid date';
}

//
//
//

const daysFromCreation = ref<number | null>(null);
const helperPreviewDate = ref<Date | null>(null);
watch(daysFromCreation, (days) => {
  if (days === null) {
    helperPreviewDate.value = null;
    return;
  }

  helperPreviewDate.value = date.addToDate(task.creationDate, { days });
});
function applyDaysFromCreation() {
  if (!helperPreviewDate.value) return;

  dueDate.value = date.formatDate(helperPreviewDate.value, 'YYYY-MM-DD');

  syncDateToInput();

  daysFromCreation.value = null;
  helperPreviewDate.value = null;
}

//
//
//

function handleSubmitButtonClicked() {
  syncInputToDate();

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
  // start
  task.preferTiming = preferTiming.value;
  task.preferSessionChaining = preferSessionChaining.value;
  task.minSessionsPerDay = minSessionsPerDay.value;
  task.minSessionsPerWeek = minSessionsPerWeek.value;
  task.minHoursPerWeek = minHoursPerWeek.value;
  task.taskBounds = taskBounds.value;
  task.allowTimespans = allowTimestamps.value;
  task.preferTimespans = preferTimestamps.value;
  task.avoidTimespans = avoidTimestamps.value;
  task.blockTimespans = blockTimestamps.value;
  // duration
  task.allowSessionSplitting = allowSessionSplitting.value;
  task.minSessionDurationMinutes = minSessionDurationMinutes.value;
  task.maxSessionDurationMinutes = maxSessionDurationMinutes.value;
  // end
  task.dueDate = dueDate.value ? new Date(dueDate.value + 'T00:00:00') : null;
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
  // start
  preferTiming.value = task.preferTiming;
  preferSessionChaining.value = task.preferSessionChaining;
  minSessionsPerDay.value = task.minSessionsPerDay;
  minSessionsPerWeek.value = task.minSessionsPerWeek;
  minHoursPerWeek.value = task.minHoursPerWeek;
  taskBounds.value = task.taskBounds;
  allowTimestamps.value = task.allowTimespans;
  preferTimestamps.value = task.preferTimespans;
  avoidTimestamps.value = task.avoidTimespans;
  blockTimestamps.value = task.blockTimespans;
  // duration
  allowSessionSplitting.value = task.allowSessionSplitting;
  minSessionDurationMinutes.value = task.minSessionDurationMinutes;
  maxSessionDurationMinutes.value = task.maxSessionDurationMinutes;
  // end
  dueDate.value = task.dueDate ? date.formatDate(task.dueDate, 'YYYY-MM-DD') : null;
  maxSessionsPerDay.value = task.maxSessionsPerDay;
  maxSessionsPerWeek.value = task.maxSessionsPerWeek;
  maxHoursPerWeek.value = task.maxHoursPerWeek;

  syncDateToInput();
});
</script>
