<template>
  <q-page class="row items-center justify-evenly">
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        color="primary"
        icon="add"
        size="large"
        v-on:click="handleTaskAddButtonClicked"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { useTasksStore } from 'src/stores/tasks';
import { useRouter } from 'vue-router';

const router = useRouter();
const tasksStore = useTasksStore();

async function handleTaskAddButtonClicked() {
  const id = tasksStore.createTask();
  await router.push(`/tasks/${id}/edit`);
}
</script>
