import type { CertBuilderOptions } from '../../types';

const BLOCK_ID = 'cert-text';
const TYPE_ID = 'cert-text';

export function registerTextPlugin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any,
  _options: CertBuilderOptions,
): void {
  editor.DomComponents.addType(TYPE_ID, {
    model: {
      defaults: {
        tagName: 'div',
        name: 'Text',
        draggable: '[data-cert-canvas]',
        droppable: false,
        editable: true,
        attributes: { 'data-cert-text': 'true' },
        content: 'Double-click to edit',
        style: {
          position: 'absolute',
          padding: '8px 12px',
          'font-size': '16px',
          'font-family': 'sans-serif',
          color: '#000',
          'min-width': '50px',
          'min-height': '24px',
          cursor: 'move',
          'z-index': '1',
        },
      },
    },
  });

  // Enable CKEditor 4 on double-click if available
  editor.on('component:dblclick', (component: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (
      component.get('type') === TYPE_ID &&
      typeof win.CKEDITOR !== 'undefined'
    ) {
      const el = component.getEl();
      if (!el) return;

      const ckEditor = win.CKEDITOR.inline(el, {
        toolbar: [
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
          { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'styles', items: ['FontSize', 'Font'] },
          { name: 'colors', items: ['TextColor'] },
        ],
        removePlugins: 'contextmenu,tabletools,tableselection,liststyle',
        on: {
          blur() {
            const data = ckEditor.getData();
            component.set('content', data);
            ckEditor.destroy();
          },
        },
      });
    }
  });

  editor.BlockManager.add(BLOCK_ID, {
    id: BLOCK_ID,
    label: 'Text',
    category: 'Certificate',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 7 4 4 20 4 20 7"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <line x1="12" y1="4" x2="12" y2="20"/>
    </svg>`,
    content: { type: TYPE_ID },
  });
}
