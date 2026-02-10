<template>
  <q-page>
    <div class="flex column full-width">
      <q-card v-for="task in tasks" v-bind:key="task.id" flat bordered class="q-mb-sm bg-grey-3">
        <q-card-section>
          <div class="text-h6">
            {{ task.name }}
            <q-badge color="blue" align="middle"> Priority: {{ task.priority }} </q-badge>
          </div>
          <div class="text-caption text-grey-8">
            {{ task.brief }}
          </div>
          <div class="flex">
            <q-icon name="alarm" class="q-mr-xs self-center" />
            {{ date.formatDate(task.creationDate, 'DD.MM.YYYY') }}
            <div v-if="task.dueDate">
              <q-icon name="arrow_right_alt" class="q-ml-xs" />
              {{ date.formatDate(task.dueDate, 'DD.MM.YYYY') }}
            </div>
          </div>
          <q-btn-group spread>
            <q-btn
              size="sm"
              color="primary"
              icon="edit"
              label="Edit"
              glossy
              no-caps
              v-on:click="handleTaskEditButtonClicked(task.id)"
            />
            <q-btn
              size="sm"
              color="negative"
              icon="delete"
              label="Delete"
              glossy
              no-caps
              v-on:click="handleTaskDeleteButtonClicked(task.id)"
            />
          </q-btn-group>
        </q-card-section>
      </q-card>
    </div>

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
import { date } from 'quasar';

const router = useRouter();
const tasksStore = useTasksStore();
const tasks = tasksStore.tasks;

async function handleTaskAddButtonClicked() {
  const id = tasksStore.createTask();
  await handleTaskEditButtonClicked(id);
}

async function handleTaskEditButtonClicked(taskId: number) {
  await router.push(`/tasks/${taskId}/edit`);
}

function handleTaskDeleteButtonClicked(taskId: number) {
  tasksStore.deleteTask(taskId);
}
</script>
