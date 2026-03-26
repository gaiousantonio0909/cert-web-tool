# cert-builder

> A certificate builder powered by GrapeJS — Image Background, CKEditor 4 text, shortcodes, and PDF export.

[![npm version](https://img.shields.io/npm/v/cert-builder.svg)](https://www.npmjs.com/package/cert-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/gaiousantonio0909/cert-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/gaiousantonio0909/cert-builder/actions/workflows/ci.yml)

---

## Features

- 🖼️ **Image Background** — Full-canvas background image with size controls
- ✏️ **Rich Text** — Inline CKEditor 4 editing on double-click
- 🔖 **Shortcodes** — `{{name}}`, `{{date}}`, `{{course}}` tokens replaced at render time
- 📄 **PDF Export** — `exportPDF()` via `html2canvas` + `jsPDF`
- 🧩 **Vue 3 Adapter** — Drop-in `<CertBuilderVue>` component
- 📦 **Only `dist/` published** to npm

---

## Installation

```bash
# pnpm (recommended)
pnpm add cert-builder
pnpm add -D grapesjs html2canvas jspdf

# npm
npm install cert-builder grapesjs html2canvas jspdf

# yarn
yarn add cert-builder grapesjs html2canvas jspdf
```

For the Vue 3 adapter:
```bash
pnpm add vue       # or npm install vue
```

### CKEditor 4 (peer dep — add to your HTML)
```html
<script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>
```

---

## Quick Start — Vanilla JS / TypeScript

```ts
import CertBuilder from 'cert-builder';

const builder = new CertBuilder({
  container: '#cert-editor',
  width: 794,
  height: 1123,
  shortcodes: ['name', 'date', 'course', 'issuer'],
  onSave: (html) => console.log(html),
  onLoad: () => console.log('Editor ready!'),
});
```

---

## Vue 3 Example

```vue
<template>
  <CertBuilderVue
    ref="certRef"
    :width="794"
    :height="1123"
    :shortcodes="['name', 'date', 'course']"
    @save="onSave"
    @load="onLoad"
  />
  <button @click="download">Export PDF</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CertBuilderVue } from 'cert-builder';

const certRef = ref();

const onSave = (html: string) => console.log(html);
const onLoad = () => certRef.value.loadTemplate('<div>My Cert</div>');
const download = () =>
  certRef.value.exportPDF({ name: 'John Doe', date: '2026-03-26' }, 'cert.pdf');
</script>
```

---

## API Reference

### Constructor Options

| Option | Type | Default | Description |
|---|---|---|---|
| `container` | `string \| HTMLElement` | **required** | Mount target |
| `width` | `number` | `794` | Canvas width px |
| `height` | `number` | `1123` | Canvas height px |
| `shortcodes` | `string[]` | `[]` | Available shortcode keys |
| `onSave` | `(html) => void` | `() => {}` | Save callback |
| `onLoad` | `() => void` | `() => {}` | Ready callback |

### Methods

| Method | Returns | Description |
|---|---|---|
| `export()` | `string` | Raw canvas HTML |
| `render(data, removeUnknown?)` | `string` | HTML with shortcodes replaced |
| `exportPDF(data?, filename?)` | `Promise<void>` | Download as PDF |
| `loadTemplate(html)` | `void` | Load HTML into editor |
| `destroy()` | `void` | Destroy editor |
| `getEditor()` | `Editor` | Raw GrapeJS instance |

---

## Shortcodes

```ts
import { parseShortcodes, extractShortcodes } from 'cert-builder';

parseShortcodes('<p>Hello {{name}}</p>', { name: 'Jane' });
// => '<p>Hello Jane</p>'

extractShortcodes('<p>{{name}} completed {{course}}</p>');
// => ['name', 'course']
```

---

## Publishing to npm

1. Add `NPM_TOKEN` to **GitHub → Settings → Secrets → Actions**
2. Create a GitHub Release with tag `v1.0.0`
3. The publish workflow auto-builds and publishes only `dist/`

---

## Local Development

```bash
pnpm install
pnpm dev       # watch mode
pnpm build     # production build → dist/
pnpm typecheck
pnpm lint
```

---

## License

MIT © [gaiousantonio0909](https://github.com/gaiousantonio0909)