<template>
  <q-page>
    <div class="full-width">
      <template v-for="(section, index) in taskSections" :key="section.title">
        <div
          v-if="section.title"
          class="row items-center q-my-md"
          :class="{ 'q-mt-md': index !== 0 }"
        >
          <q-separator class="col" />
          <div class="q-px-sm text-grey-6 text-caption">
            <q-icon :name="section.icon" />
            {{ section.title }}
          </div>
          <q-separator class="col" />
        </div>

        <q-card
          v-for="task in section.tasks"
          :key="task.id"
          flat
          bordered
          class="q-mb-sm bg-grey-3"
        >
          <q-card-section class="q-pa-sm">
            <div class="text-h6">
              {{ task.name }}
              <q-badge align="middle" :style="{ backgroundColor: getPriorityColor(task.priority) }">
                P {{ task.priority }}
              </q-badge>
            </div>
            <div class="text-caption text-grey-8">
              {{ task.brief }}
            </div>
            <div class="row items-center">
              <q-icon name="alarm" class="q-mr-xs" />
              <span>{{ date.formatDate(task.creationDate, 'DD.MM.YYYY') }}</span>

              <template v-if="task.dueDate">
                <q-icon name="arrow_right_alt" class="q-ml-xs q-mr-xs" />
                <span>{{ date.formatDate(task.dueDate, 'DD.MM.YYYY') }}</span>
              </template>
            </div>
          </q-card-section>
          <q-card-actions class="q-pa-none">
            <q-btn-group spread class="full-width">
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
          </q-card-actions>
        </q-card>
      </template>
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
import { computed } from 'vue';

const router = useRouter();
const tasksStore = useTasksStore();
const tasks = tasksStore.tasks;
const taskSections = computed(() => {
  const withDue = tasks.filter((t) => t.dueDate).toSorted((a, b) => b.priority - a.priority);
  const withoutDue = tasks.filter((t) => !t.dueDate).toSorted((a, b) => b.priority - a.priority);
  const sections = [];
  if (withDue.length) {
    sections.push({
      title: 'Finite',
      icon: 'event',
      tasks: withDue,
    });
  }
  if (withoutDue.length) {
    sections.push({
      title: 'Ongoing',
      icon: 'all_inclusive',
      tasks: withoutDue,
    });
  }
  return sections;
});

const maxTaskPriority = computed(() =>
  Math.max(1, ...tasksStore.tasks.map((task) => task.priority)),
);

function getPriorityColor(priority: number) {
  const ratio = priority / maxTaskPriority.value;

  // 120 = green, 0 = red
  const hue = 120 - 120 * ratio;

  return `hsl(${hue}, 70%, 40%)`;
}

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
