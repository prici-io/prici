<script setup lang="ts">
import { onMounted, ref, defineProps } from 'vue'
import monacoService from '../services/monaco.service'

const props = defineProps({
  modelValue: String,
  language: {
    type: String,
    default: 'json'
  }
})

const monacoRef = ref();
const monacoInstance = ref<ReturnType<typeof monacoService.editor.create>>()

onMounted(() => {
  monacoInstance.value = monacoService.editor.create(monacoRef.value, {
    theme: 'vs-dark',
    language: props.language,
    value: props.modelValue
  })
})

</script>

<template>
  <div class="monaco" ref="monacoRef" @input.stop="$emit('update:modelValue', $event?.target?.value)"></div>
</template>
<style scoped>
.monaco {
  min-height: 350px;
  width: 100%;
  margin-block-end: 15px;
}
</style>