<template>
  <div class="q-gutter-y-sm">
    <task-bound-edit v-for="(bound, index) in model" v-bind:key="bound.id" v-model="model[index]!">
      <q-btn
        class="q-pa-sm"
        size="sm"
        color="negative"
        icon="delete"
        glossy
        no-caps
        v-on:click="handleDeleteButtonClicked(bound.id)"
      />
    </task-bound-edit>
    <q-btn
      size="sm"
      color="primary"
      icon="add"
      label="Add"
      type="button"
      glossy
      no-caps
      v-on:click="handleAddButtonClicked"
    />
  </div>
</template>

<script setup lang="ts">
import type { TaskBound } from 'src/types';
import TaskBoundEdit from './TaskBoundEdit.vue';
import { generateRandomUUID } from 'src/utils';

const model = defineModel<TaskBound[]>({ required: true });

export interface TaskBoundListEditProps {
  parentTaskId: number;
}
const props = defineProps<TaskBoundListEditProps>();

const handleAddButtonClicked = () => {
  model.value = [
    ...model.value,
    {
      id: generateRandomUUID(),
      parentTaskId: props.parentTaskId,
      position: 'after',
      adjacent: false,
      childTaskIds: [],
      priority: 1,
    },
  ];
};

const handleDeleteButtonClicked = (boundId: string) => {
  model.value = model.value.filter((bound) => bound.id !== boundId);
};
</script>
