<template>
  <div ref="containerRef" class="cert-builder-vue" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CertBuilder } from '../../CertBuilder';
import type { CertBuilderOptions, ShortcodeMap } from '../../types';

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    shortcodes?: string[];
  }>(),
  { width: 794, height: 1123, shortcodes: () => [] },
);

const emit = defineEmits<{
  (e: 'save', html: string): void;
  (e: 'load'): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let builderInstance: CertBuilder | null = null;

onMounted(() => {
  if (!containerRef.value) return;
  const options: CertBuilderOptions = {
    container: containerRef.value,
    width: props.width,
    height: props.height,
    shortcodes: props.shortcodes,
    onSave: (html) => emit('save', html),
    onLoad: () => emit('load'),
  };
  builderInstance = new CertBuilder(options);
});

onBeforeUnmount(() => {
  builderInstance?.destroy();
  builderInstance = null;
});

defineExpose({
  export: (): string => builderInstance?.export() ?? '',
  render: (data: ShortcodeMap, removeUnknown?: boolean): string =>
    builderInstance?.render(data, removeUnknown) ?? '',
  exportPDF: (data?: ShortcodeMap, filename?: string): Promise<void> =>
    builderInstance?.exportPDF(data, filename) ?? Promise.resolve(),
  loadTemplate: (html: string): void => builderInstance?.loadTemplate(html),
  getEditor: () => builderInstance?.getEditor(),
});
</script>

<style scoped>
.cert-builder-vue { width: 100%; height: 100%; }
</style>