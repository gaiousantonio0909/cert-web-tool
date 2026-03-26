import grapesjs, { Editor } from 'grapesjs';
import { CertBuilderOptions, ShortcodeMap } from './types';
import { registerBackgroundPlugin } from './plugins/background';
import { registerTextPlugin } from './plugins/text-ckeditor';
import { registerShortcodePlugin } from './plugins/shortcodes';
import { parseShortcodes } from './utils/shortcode-parser';

export class CertBuilder {
    private editor!: Editor;
    private options: Required<CertBuilderOptions>;

    constructor(options: CertBuilderOptions) {
        this.options = {
            width: 794,
            height: 1123,
            shortcodes: [],
            onSave: () => undefined,
            onLoad: () => undefined,
            ...options,
        };
        this.init();
    }

    private init(): void {
        const { container, width, height } = this.options;

        this.editor = grapesjs.init({
            container,
            height: `${height}px`,
            width: `${width}px`,
            storageManager: false,
            panels: { defaults: [] },
            blockManager: { appendTo: '[data-cert-blocks]', blocks: [] },
            deviceManager: { devices: [] },
            commands: { defaults: {} },
        });

        registerBackgroundPlugin(this.editor, this.options);
        registerTextPlugin(this.editor, this.options);
        registerShortcodePlugin(this.editor, this.options);

        this.editor.Commands.add('cert-save', {
            run: () => this.options.onSave(this.export()),
        });

        this.editor.on('load', () => this.options.onLoad());
    }

    export(): string {
        return this.editor.getHtml();
    }

    render(data: ShortcodeMap, removeUnknown = false): string {
        return parseShortcodes(this.export(), data, removeUnknown);
    }

    async exportPDF(data?: ShortcodeMap, filename = 'certificate.pdf'): Promise<void> {
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf'),
        ]);

        const { width, height } = this.options;
        const canvasFrame = this.editor.Canvas.getFrameEl() as HTMLIFrameElement;
        const body = canvasFrame?.contentDocument?.body;

        if (!body) throw new Error('[cert-builder] Cannot access canvas frame for PDF export.');

        let tempContainer: HTMLDivElement | null = null;
        let targetEl: HTMLElement = body;

        if (data) {
            const rendered = this.render(data);
            tempContainer = document.createElement('div');
            tempContainer.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${width}px;height:${height}px;overflow:hidden;`;
            tempContainer.innerHTML = rendered;
            document.body.appendChild(tempContainer);
            targetEl = tempContainer;
        }

        const canvas = await html2canvas(targetEl, { scale: 2, useCORS: true, width, height });
        const pdf = new jsPDF({
            orientation: width > height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [width, height],
        });

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
        pdf.save(filename);

        if (tempContainer) document.body.removeChild(tempContainer);
    }

    loadTemplate(html: string): void {
        this.editor.setComponents(html);
    }

    destroy(): void {
        this.editor.destroy();
    }

    getEditor(): Editor {
        return this.editor;
    }
}

export default CertBuilder;