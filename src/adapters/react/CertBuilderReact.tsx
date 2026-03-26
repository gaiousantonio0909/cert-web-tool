import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CertBuilder } from '../../CertBuilder';
import type { CertBuilderOptions, CertBuilderTheme, ShortcodeMap, Orientation } from '../../types';

export interface CertBuilderReactProps {
  width?: number;
  height?: number;
  orientation?: Orientation;
  shortcodes?: string[];
  onSave?: (html: string) => void;
  onLoad?: () => void;
  onUpload?: (file: File) => Promise<string>;
  theme?: CertBuilderTheme;
  className?: string;
  style?: React.CSSProperties;
}

export interface CertBuilderReactRef {
  export: () => string;
  render: (data: ShortcodeMap, removeUnknown?: boolean) => string;
  exportPDF: (data?: ShortcodeMap, filename?: string) => Promise<void>;
  exportJson: () => Record<string, unknown>;
  importJson: (json: Record<string, unknown>) => void;
  loadTemplate: (html: string) => void;
  getEditor: () => ReturnType<CertBuilder['getEditor']> | undefined;
}

const CertBuilderReact = forwardRef<CertBuilderReactRef, CertBuilderReactProps>(
  ({ width, height, orientation, shortcodes = [], onSave, onLoad, onUpload, theme, className, style }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const builderRef = useRef<CertBuilder | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const options: CertBuilderOptions = {
        container: containerRef.current,
        ...(width != null && { width }),
        ...(height != null && { height }),
        orientation,
        shortcodes,
        onSave: onSave ?? (() => undefined),
        onLoad: onLoad ?? (() => undefined),
        onUpload,
        theme,
      };

      builderRef.current = new CertBuilder(options);

      return () => {
        builderRef.current?.destroy();
        builderRef.current = null;
      };
    }, [width, height, orientation]);

    useImperativeHandle(ref, () => ({
      export: () => builderRef.current?.export() ?? '',
      render: (data: ShortcodeMap, removeUnknown?: boolean) =>
        builderRef.current?.render(data, removeUnknown) ?? '',
      exportPDF: (data?: ShortcodeMap, filename?: string) =>
        builderRef.current?.exportPDF(data, filename) ?? Promise.resolve(),
      exportJson: () => builderRef.current?.exportJson() ?? {},
      importJson: (json: Record<string, unknown>) => builderRef.current?.importJson(json),
      loadTemplate: (html: string) => builderRef.current?.loadTemplate(html),
      getEditor: () => builderRef.current?.getEditor(),
    }));

    return (
      <div
        ref={containerRef}
        className={className ?? 'cert-builder-react'}
        style={style ?? { width: '100%', height: '100%' }}
      />
    );
  },
);

CertBuilderReact.displayName = 'CertBuilderReact';

export default CertBuilderReact;
export { CertBuilderReact };
