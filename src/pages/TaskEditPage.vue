<template>
  <q-page class="flex column">
    <div class="text-h5">Editing Task #{{ taskId }}</div>
    <div class="flex text-grey-8 q-mb-xs">
      <q-icon name="alarm" class="self-center q-mr-xs" />
      <div>Created {{ date.formatDate(task.creationDate, 'DD.MM.YYYY') }}</div>
    </div>
    <q-separator class="q-mb-md" />
    <q-form
      ref="form"
      @submit="handleSubmitButtonClicked"
      @reset="handleCancelButtonClicked"
      class="q-gutter-md"
    >
      <q-input outlined v-model="name" label="Name" />
      <q-input outlined v-model="brief" label="Brief" />
      <q-input
        outlined
        type="number"
        v-model.number="priority"
        label="Priority"
        lazy-rules
        hide-bottom-space
        :rules="[
          (val) => (val !== null && val !== '') || 'Required',
          (val) => Number.isInteger(Number(val)) || 'Please enter a whole number',
        ]"
      />
      <q-input
        outlined
        v-model="dueDateInput"
        label="Due date"
        mask="##.##.####"
        hide-bottom-space
        :rules="[validateDueDate]"
        @blur="syncInputToDate"
      >
        <template #append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover>
              <q-date v-model="dueDate" mask="YYYY-MM-DD" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div
        class="flex items-center text-caption text-grey-7 q-gutter-x-sm q-mt-none q-pa-sm bg-grey-2"
      >
        <span>Set due days</span>

        <q-input class="col" dense outlined type="number" v-model.number="daysFromCreation" />

        <span v-if="helperPreviewDate && daysFromCreation">
          → {{ date.formatDate(helperPreviewDate, 'DD.MM.YYYY') }}
          <q-btn
            flat
            dense
            icon="check"
            @click="applyDaysFromCreation"
            :disable="!helperPreviewDate"
          />
        </span>
      </div>
    </q-form>
    <q-space />
    <div class="flex justify-between">
      <q-btn
        color="white"
        text-color="black"
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

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { onMounted, ref, watch } from 'vue';
import { useTasksStore } from 'src/stores/tasks';
import { QForm } from 'quasar';
import { date } from 'quasar';

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
  task.name = name.value ?? '';
  task.brief = brief.value ?? '';
  task.priority = priority.value ?? 1;
  task.dueDate = dueDate.value ? new Date(dueDate.value + 'T00:00:00') : null;
  router.back();
}

function handleCancelButtonClicked() {
  router.back();
}

onMounted(() => {
  name.value = task.name;
  brief.value = task.brief;
  priority.value = task.priority;
  dueDate.value = task.dueDate ? date.formatDate(task.dueDate, 'YYYY-MM-DD') : null;

  syncDateToInput();
});
</script>
