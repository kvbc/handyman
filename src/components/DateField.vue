<template>
  <div>
    <q-input
      outlined
      dense
      square
      :label="label"
      v-model="inputValue"
      mask="##.##.#### ##:##"
      :rules="[validate]"
      @blur="syncInputToModel"
      hide-bottom-space
    >
      <template #prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="internalModel" mask="YYYY-MM-DD HH:mm" />
          </q-popup-proxy>
        </q-icon>
      </template>

      <template #append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="internalModel" mask="YYYY-MM-DD HH:mm" format24h />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Days helper -->
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
        <q-btn flat dense icon="check" @click="applyOffset" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { date } from 'quasar';

const props = defineProps<{
  modelValue: Date | null;
  label: string;
  baseDate?: Date | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void;
}>();

// Quasar works on string — we bridge it
const internalModel = ref<string | null>(null);
const inputValue = ref('');

// Model → UI
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      internalModel.value = null;
      inputValue.value = '';
      return;
    }

    internalModel.value = date.formatDate(val, 'YYYY-MM-DD HH:mm');
    inputValue.value = date.formatDate(val, 'DD.MM.YYYY HH:mm');
  },
  { immediate: true },
);

// UI → Model
watch(internalModel, (val) => {
  if (!val) {
    emit('update:modelValue', null);
    return;
  }

  const parsed = date.extractDate(val, 'YYYY-MM-DD HH:mm');
  emit('update:modelValue', parsed || null);
});

// Manual input
function syncInputToModel() {
  if (!inputValue.value) {
    emit('update:modelValue', null);
    return;
  }

  const parsed =
    date.extractDate(inputValue.value, 'DD.MM.YYYY HH:mm') ||
    date.extractDate(inputValue.value, 'DD.MM.YYYY');

  if (parsed) {
    internalModel.value = date.formatDate(parsed, 'YYYY-MM-DD HH:mm');
  }
}

function validate(val: string) {
  if (!val) return true;

  const parsed = date.extractDate(val, 'DD.MM.YYYY HH:mm') || date.extractDate(val, 'DD.MM.YYYY');

  return parsed ? true : 'Invalid date';
}

function formatDisplay(d: Date) {
  return date.formatDate(d, 'DD.MM.YYYY HH:mm');
}

// Offset helper
const daysOffset = ref<number | null>(null);

const previewDate = computed(() => {
  if (!props.baseDate || daysOffset.value == null) return null;
  return date.addToDate(props.baseDate, { days: daysOffset.value });
});

function applyOffset() {
  if (!previewDate.value) return;
  emit('update:modelValue', previewDate.value);
  daysOffset.value = null;
}
</script>
