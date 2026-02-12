<template>
  <div class="q-gutter-y-sm">
    <timespan-edit
      v-for="(timespan, index) in model"
      v-bind:key="timespan.id"
      v-model="model[index]!"
    >
      <q-btn
        class="q-pa-sm"
        size="sm"
        color="negative"
        icon="delete"
        glossy
        no-caps
        v-on:click="handleDeleteButtonClicked(timespan.id)"
      />
    </timespan-edit>
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
import type { Timespan } from 'src/types';
import TimespanEdit from './TimespanEdit.vue';
import { generateRandomUUID } from 'src/utils';

const model = defineModel<Timespan[]>({ required: true });

const handleAddButtonClicked = () => {
  model.value = [
    ...model.value,
    {
      id: generateRandomUUID(),
      rrText: '',
      startHour: 0,
      endHour: 24,
    },
  ];
};

const handleDeleteButtonClicked = (id: string) => {
  model.value = model.value.filter((timespan) => timespan.id !== id);
};
</script>
