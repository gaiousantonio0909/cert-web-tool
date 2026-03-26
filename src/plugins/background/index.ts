import type { CertBuilderOptions } from '../../types';

const BLOCK_ID = 'cert-background';
const TYPE_ID = 'cert-background';

export function registerBackgroundPlugin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any,
  options: CertBuilderOptions,
): void {
  const { width = 794, height = 1123 } = options;

  editor.DomComponents.addType(TYPE_ID, {
    model: {
      defaults: {
        tagName: 'div',
        name: 'Background',
        draggable: false,
        droppable: true,
        removable: false,
        copyable: false,
        attributes: { 'data-cert-canvas': 'true' },
        style: {
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          overflow: 'hidden',
        },
        traits: [
          {
            type: 'text',
            name: 'backgroundImage',
            label: 'Background Image URL',
            changeProp: true,
          },
          {
            type: 'select',
            name: 'backgroundSize',
            label: 'Background Size',
            options: [
              { id: 'cover', label: 'Cover' },
              { id: 'contain', label: 'Contain' },
              { id: '100% 100%', label: 'Stretch' },
            ],
            changeProp: true,
          },
        ],
      },
      init(this: any) {
        this.listenTo(this, 'change:backgroundImage', this.onBgImageChange);
        this.listenTo(this, 'change:backgroundSize', this.onBgSizeChange);
      },
      onBgImageChange(this: any) {
        const url = this.get('backgroundImage') as string;
        if (url) {
          this.addStyle({ 'background-image': `url(${url})` });
        } else {
          this.removeStyle('background-image');
        }
      },
      onBgSizeChange(this: any) {
        const size = (this.get('backgroundSize') as string) || 'cover';
        this.addStyle({ 'background-size': size });
      },
    },
  });

  editor.BlockManager.add(BLOCK_ID, {
    id: BLOCK_ID,
    label: 'Background',
    category: 'Certificate',
    media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>`,
    content: { type: TYPE_ID },
  });

  // Auto-add background on editor load if canvas is empty
  editor.on('load', () => {
    const wrapper = editor.getWrapper();
    if (wrapper && wrapper.components().length === 0) {
      wrapper.append({ type: TYPE_ID });
    }
  });
}
