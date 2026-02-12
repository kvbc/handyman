<template>
  <div class="bg-grey-3 flex">
    <div class="col">
      <q-input outlined v-model="model.rrText" label="RRule Text" dense />
      <div class="flex">
        <q-input
          class="col"
          outlined
          type="number"
          v-model.number="model.startHour"
          label="Start Hour"
          lazy-rules
          dense
          hide-bottom-space
        />
        <q-input
          class="col"
          outlined
          dense
          type="number"
          v-model.number="model.endHour"
          label="End Hour"
          lazy-rules
          hide-bottom-space
        />
      </div>
      <div class="row items-center justify-between">
        <div>Constraint</div>
        <q-btn-toggle
          v-model="model.constraint"
          size="sm"
          push
          glossy
          toggle-color="primary"
          :options="constraintOptions"
        />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { Timespan } from 'src/types';

const model = defineModel<Timespan>({ required: true });

const constraintOptions = [
  {
    label: 'Hard',
    value: 'hard',
  },
  {
    label: 'Soft',
    value: 'soft',
  },
];
</script>
