import type { CertBuilderOptions } from '../../types';
import flexboxPlugin from 'grapesjs-blocks-flexbox';

const colSvg = (bars: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${bars}</svg>`;

const cellAttrs = (extra: Record<string, string> = {}) => ({
  class: 'cell',
  'data-gjs-draggable': '.row',
  'data-gjs-resizable': JSON.stringify({ tl:0, tc:0, tr:0, cl:0, cr:1, bl:0, br:0, minDim:1, bc:0, keyWidth:'flex-basis', currentUnit:1, step:0.2 }),
  'data-gjs-custom-name': 'Column',
  'data-gjs-unstylable': '["width"]',
  'data-gjs-stylable-require': '["flex-basis"]',
  ...extra,
});

const rowAttrs = () => ({
  class: 'row',
  'data-gjs-droppable': '.cell',
  'data-gjs-resizable': JSON.stringify({ tl:0, tc:0, tr:0, cl:0, cr:0, bl:0, br:0, minDim:1, bc:0 }),
  'data-gjs-custom-name': 'Row',
});

function attrStr(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([k, v]) => {
      const isObj = v.startsWith('{') || v.startsWith('[');
      return `${k}=${isObj ? `'${v}'` : `"${v}"`}`;
    })
    .join(' ');
}

function buildCols(n: number, flexValues?: number[]): string {
  const ra = attrStr(rowAttrs());
  const cells = Array.from({ length: n }, (_, i) => {
    const flex = flexValues?.[i] ?? 1;
    const ca = attrStr(cellAttrs());
    return `<div ${ca} style="flex-grow:${flex};flex-basis:100%;min-height:75px;"></div>`;
  }).join('\n          ');

  return `
    <div ${ra}>
      ${cells}
    </div>
    <style>
      .row { display:flex; justify-content:flex-start; align-items:stretch; flex-wrap:nowrap; padding:10px; }
      @media (max-width:768px) { .row { flex-wrap:wrap; } }
      .cell { min-height:75px; flex-grow:1; flex-basis:100%; }
    </style>
  `;
}

export function registerColumnsPlugin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any,
  _options: CertBuilderOptions,
): void {
  // Register the official flexbox plugin (adds row/cell types + styles)
  flexboxPlugin(editor, {
    flexboxBlock: {
      label: '2 Columns',
      category: 'Layout',
      attributes: {},
      media: colSvg(
        '<rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/>',
      ),
    },
  });

  // Additional column variants using the same row/cell classes
  editor.BlockManager.add('cert-columns-1', {
    id: 'cert-columns-1',
    label: '1 Column',
    category: 'Layout',
    media: colSvg('<rect x="4" y="3" width="16" height="18" rx="1"/>'),
    content: buildCols(1),
  });

  editor.BlockManager.add('cert-columns-3', {
    id: 'cert-columns-3',
    label: '3 Columns',
    category: 'Layout',
    media: colSvg(
      '<rect x="1" y="3" width="6" height="18" rx="1"/><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="17" y="3" width="6" height="18" rx="1"/>',
    ),
    content: buildCols(3),
  });

  editor.BlockManager.add('cert-columns-4', {
    id: 'cert-columns-4',
    label: '4 Columns',
    category: 'Layout',
    media: colSvg(
      '<rect x="1" y="3" width="4.5" height="18" rx="1"/><rect x="7" y="3" width="4.5" height="18" rx="1"/><rect x="13" y="3" width="4.5" height="18" rx="1"/><rect x="19" y="3" width="4" height="18" rx="1"/>',
    ),
    content: buildCols(4),
  });

  editor.BlockManager.add('cert-columns-1-2', {
    id: 'cert-columns-1-2',
    label: '1/3 + 2/3',
    category: 'Layout',
    media: colSvg(
      '<rect x="2" y="3" width="6" height="18" rx="1"/><rect x="10" y="3" width="12" height="18" rx="1"/>',
    ),
    content: buildCols(2, [1, 2]),
  });
}
