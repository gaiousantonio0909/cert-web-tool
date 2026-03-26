import type { CertBuilderOptions } from '../../types';

const BLOCK_ID = 'cert-text';
const TYPE_ID = 'cert-text';

export function registerTextPlugin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any,
  options: CertBuilderOptions,
): void {
  const shortcodes = options.shortcodes ?? [];

  // Extend GrapesJS built-in 'text' type so inline RTE editing works out of the box
  editor.DomComponents.addType(TYPE_ID, {
    extend: 'text',
    model: {
      defaults: {
        tagName: 'div',
        name: 'Text',
        draggable: '[data-cert-canvas], [data-gjs-droppable], .cell, .row, .cert-column, .cert-row',
        droppable: false,
        attributes: { 'data-cert-text': 'true' },
        content: 'Double-click to edit',
        style: {
          padding: '8px 12px',
          'font-size': '16px',
          'font-family': 'sans-serif',
          color: '#000',
          'min-width': '50px',
          'min-height': '24px',
          'z-index': '1',
        },
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;

  if (typeof win.CKEDITOR !== 'undefined') {
    // Register the shortcodes CKEditor plugin once (richcombo dropdown)
    if (shortcodes.length > 0 && !win.CKEDITOR.plugins.get('certshortcodes')) {
      win.CKEDITOR.plugins.add('certshortcodes', {
        requires: 'richcombo',
        init(ckEditor: any) {
          const codes: string[] = ckEditor.config.certShortcodes || [];
          if (!codes.length) return;

          ckEditor.ui.addRichCombo('Shortcodes', {
            label: 'Shortcodes',
            title: 'Insert Shortcode',
            toolbar: 'insert',
            panel: {
              css: [win.CKEDITOR.skin.getPath('editor')],
              multiSelect: false,
            },
            init() {
              this.startGroup('Available Shortcodes');
              for (const key of codes) {
                this.add(key, `{{${key}}}`, key);
              }
            },
            onClick(value: string) {
              ckEditor.insertText(`{{${value}}}`);
            },
          });
        },
      });
    }

    editor.setCustomRte({
      enable(el: HTMLElement, rte: any) {
        if (rte) return rte;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config: any = {
          toolbar: [
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
            { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
            { name: 'styles', items: ['FontSize', 'Font'] },
            { name: 'colors', items: ['TextColor'] },
          ],
          removePlugins: 'contextmenu,tabletools,tableselection,liststyle',
        };

        if (shortcodes.length > 0) {
          config.extraPlugins = 'certshortcodes';
          config.certShortcodes = shortcodes;
          config.toolbar.push({ name: 'insert', items: ['Shortcodes'] });
        }

        return win.CKEDITOR.inline(el, config);
      },
      disable(el: HTMLElement, rte: any) {
        if (rte?.destroy) rte.destroy();
      },
    });
  } else if (shortcodes.length > 0) {
    // No CKEditor – add shortcode buttons to GrapesJS built-in RTE toolbar
    for (const key of shortcodes) {
      editor.RichTextEditor.add(`shortcode-${key}`, {
        icon: `<span style="font-size:11px;font-family:monospace;white-space:nowrap;">{{${key}}}</span>`,
        result: (rte: any) => rte.insertHTML(`{{${key}}}`),
      });
    }
  }

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
