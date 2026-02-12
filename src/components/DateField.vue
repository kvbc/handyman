<template>
  <div>
    <q-input
      outlined
      dense
      square
      :label="label"
      v-model="inputValue"
      mask="##.##.####"
      :rules="[validate]"
      @blur="syncInputToModel"
      hide-bottom-space
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover>
            <q-date v-model="internalModel" mask="YYYY-MM-DD" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Optional helper -->
    <div v-if="baseDate" class="row items-center text-caption text-grey-7 bg-grey-3">
      <q-input
        class="col"
        square
        dense
        outlined
        type="number"
        v-model.number="daysOffset"
        label="Set days"
      />

      <div v-if="previewDate && daysOffset" class="q-ml-sm">
        → {{ formatDisplay(previewDate) }}
        <q-btn flat dense icon="check" @click="applyOffset" :disable="!previewDate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { date } from 'quasar';

const props = defineProps<{
  modelValue: string | null;
  label: string;
  baseDate?: Date | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
}>();

const internalModel = ref<string | null>(props.modelValue);
const inputValue = ref('');

//
// Sync model → input
//

watch(
  () => props.modelValue,
  (val) => {
    internalModel.value = val;
    if (!val) {
      inputValue.value = '';
      return;
    }

    const parsed = date.extractDate(val, 'YYYY-MM-DD');
    if (parsed) {
      inputValue.value = date.formatDate(parsed, 'DD.MM.YYYY');
    }
  },
  { immediate: true },
);

//
// Sync q-date → parent
//

watch(internalModel, (val) => {
  emit('update:modelValue', val);
});

//
// Manual input → model
//

function syncInputToModel() {
  if (!inputValue.value) {
    emit('update:modelValue', null);
    return;
  }

  const parsed = date.extractDate(inputValue.value, 'DD.MM.YYYY');
  if (parsed) {
    const iso = date.formatDate(parsed, 'YYYY-MM-DD');
    emit('update:modelValue', iso);
  }
}

function validate(val: string) {
  if (!val) return true;
  return !!date.extractDate(val, 'DD.MM.YYYY') || 'Invalid date';
}

function formatDisplay(d: Date) {
  return date.formatDate(d, 'DD.MM.YYYY');
}

//
// Optional days helper
//

const daysOffset = ref<number | null>(null);

const previewDate = computed(() => {
  if (!props.baseDate || daysOffset.value == null) return null;
  return date.addToDate(props.baseDate, { days: daysOffset.value });
});

function applyOffset() {
  if (!previewDate.value) return;
  const iso = date.formatDate(previewDate.value, 'YYYY-MM-DD');
  emit('update:modelValue', iso);
  daysOffset.value = null;
}
</script>
