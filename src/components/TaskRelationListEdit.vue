<template>
  <div class="q-gutter-y-sm">
    <task-relation-edit
      v-for="(relation, index) in model"
      v-bind:key="relation.id"
      v-model="model[index]!"
    >
      <q-btn
        class="q-pa-sm"
        size="sm"
        color="negative"
        icon="delete"
        glossy
        no-caps
        v-on:click="handleDeleteButtonClicked(relation.id)"
      />
    </task-relation-edit>
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
import type { TaskRelation } from 'src/types';
import { generateRandomUUID } from 'src/utils';
import TaskRelationEdit from './TaskRelationEdit.vue';

const model = defineModel<TaskRelation[]>({ required: true });

export interface TaskRelationListEditProps {
  parentTaskId: number;
}
const props = defineProps<TaskRelationListEditProps>();

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

const handleDeleteButtonClicked = (id: string) => {
  model.value = model.value.filter((relation) => relation.id !== id);
};
</script>
