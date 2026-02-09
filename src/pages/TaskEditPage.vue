<template>
  <q-page class="flex column">
    <h5>Editing task #{{ taskId }}</h5>
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
        :rules="[
          (val) => (val !== null && val !== '') || 'Required',
          (val) => Number.isInteger(Number(val)) || 'Please enter a whole number',
        ]"
      />
    </q-form>
    <q-space />
    <div class="flex justify-between">
      <q-btn
        color="white"
        text-color="black"
        label="Cancel"
        type="reset"
        v-on:click="handleCancelButtonClicked"
      />
      <q-btn color="primary" label="Save" type="submit" v-on:click="handleSubmitButtonClicked" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useTasksStore } from 'src/stores/tasks';
import { QForm } from 'quasar';

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

function handleSubmitButtonClicked() {
  if (!form.value?.validate()) return;

  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Submitted',
  });
  task.name = name.value ?? '';
  task.brief = brief.value ?? '';
  task.priority = priority.value ?? 1;
  router.back();
}

function handleCancelButtonClicked() {
  router.back();
}

onMounted(() => {
  name.value = task.name;
  brief.value = task.brief;
  priority.value = task.priority;
});
</script>
