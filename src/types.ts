import type { Editor } from 'grapesjs';

export interface CertBuilderOptions {
  container: string | HTMLElement;
  width?: number;
  height?: number;
  shortcodes?: string[];
  onSave?: (html: string) => void;
  onLoad?: () => void;
}

export type ShortcodeMap = Record<string, string>;

export interface CertBuilderPlugin {
  (editor: Editor, options: CertBuilderOptions): void;
}
