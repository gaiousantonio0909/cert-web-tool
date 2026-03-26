<template>
  <div ref="containerRef" class="cert-builder-vue" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { CertBuilder } from '../../CertBuilder';
import type { CertBuilderOptions, CertBuilderTheme, ShortcodeMap, Orientation } from '../../types';

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    orientation?: Orientation;
    shortcodes?: string[];
    onUpload?: (file: File) => Promise<string>;
    theme?: CertBuilderTheme;
  }>(),
  { width: undefined, height: undefined, orientation: undefined, shortcodes: () => [], onUpload: undefined, theme: undefined },
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
    ...(props.width != null && { width: props.width }),
    ...(props.height != null && { height: props.height }),
    orientation: props.orientation,
    shortcodes: props.shortcodes,
    onSave: (html) => emit('save', html),
    onLoad: () => emit('load'),
    onUpload: props.onUpload,
    theme: props.theme,
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