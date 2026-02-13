<template>
  <div class="bg-grey-3 flex q-py-sm q-gutter-x-sm">
    <div class="col q-gutter-y-sm">
      <div class="flex">
        <div class="col">Position</div>
        <q-option-group
          v-model="model.position"
          :options="positionOptions"
          color="primary"
          dense
          inline
        />
      </div>
      <div class="flex">
        <div class="col">Adjacent</div>
        <q-toggle v-model="model.adjacent" dense />
      </div>
      <q-input
        outlined
        type="number"
        v-model.number="model.priority"
        label="Priority"
        dense
        lazy-rules
        hide-bottom-space
      />
      <div class="q-gutter-y-sm">
        <div v-for="task in modelTasks" v-bind:key="task.id" class="bg-grey-4 q-pa-sm flex">
          <div class="col">
            <div>
              <q-badge color="blue">#{{ task.id }}</q-badge>
              {{ task.name }}
            </div>
            <div class="text-caption text-grey-8">{{ task.brief }}</div>
          </div>
          <q-btn
            size="sm"
            color="negative"
            icon="delete"
            glossy
            no-caps
            v-on:click="handleDeleteTaskButtonClicked(task.id)"
          />
        </div>
      </div>
      <div class="flex">
        <q-select
          class="col"
          outlined
          emit-value
          dense
          v-model="selectedTaskId"
          :options="taskSelectOptions"
          label="Task"
        />
        <q-btn
          size="sm"
          color="primary"
          icon="add"
          label="Add Task"
          glossy
          no-caps
          v-on:click="handleAddTaskButtonClicked"
        />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from 'src/stores/useTasksStore';
import type { TaskRelation } from 'src/types';
import { computed, ref } from 'vue';

const model = defineModel<TaskRelation>({ required: true });
const tasksStore = useTasksStore();
const selectedTaskId = ref<number | null>(null);
const modelTasks = computed(() =>
  tasksStore.tasks.filter((task) => model.value.childTaskIds.includes(task.id)),
);

const positionOptions = [
  {
    label: 'Before',
    value: 'before',
  },
  {
    label: 'After',
    value: 'after',
  },
];

const taskSelectOptions = computed(() =>
  tasksStore.tasks
    .filter(
      (task) => !model.value.childTaskIds.includes(task.id) && task.id !== model.value.parentTaskId,
    )
    .map((task) => ({
      label: task.name,
      value: task.id,
    })),
);

const handleAddTaskButtonClicked = () => {
  if (selectedTaskId.value) {
    console.log('add task', selectedTaskId.value, 'to task relation', model.value.id);
    model.value.childTaskIds = [...model.value.childTaskIds, selectedTaskId.value];
    selectedTaskId.value = null;
  }
};

const handleDeleteTaskButtonClicked = (taskId: number) => {
  model.value.childTaskIds = model.value.childTaskIds.filter((id) => id !== taskId);
};
</script>
