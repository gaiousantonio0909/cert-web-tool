import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { CertBuilder } from '../../CertBuilder';
import type { CertBuilderOptions, ShortcodeMap } from '../../types';

export interface CertBuilderReactProps {
  width?: number;
  height?: number;
  shortcodes?: string[];
  onSave?: (html: string) => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface CertBuilderReactRef {
  export: () => string;
  render: (data: ShortcodeMap, removeUnknown?: boolean) => string;
  exportPDF: (data?: ShortcodeMap, filename?: string) => Promise<void>;
  loadTemplate: (html: string) => void;
  getEditor: () => ReturnType<CertBuilder['getEditor']> | undefined;
}

const CertBuilderReact = forwardRef<CertBuilderReactRef, CertBuilderReactProps>(
  ({ width = 794, height = 1123, shortcodes = [], onSave, onLoad, className, style }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const builderRef = useRef<CertBuilder | null>(null);

    useEffect(() => {
      if (!containerRef.current) return;

      const options: CertBuilderOptions = {
        container: containerRef.current,
        width,
        height,
        shortcodes,
        onSave: onSave ?? (() => undefined),
        onLoad: onLoad ?? (() => undefined),
      };

      builderRef.current = new CertBuilder(options);

      return () => {
        builderRef.current?.destroy();
        builderRef.current = null;
      };
    }, [width, height]);

    useImperativeHandle(ref, () => ({
      export: () => builderRef.current?.export() ?? '',
      render: (data: ShortcodeMap, removeUnknown?: boolean) =>
        builderRef.current?.render(data, removeUnknown) ?? '',
      exportPDF: (data?: ShortcodeMap, filename?: string) =>
        builderRef.current?.exportPDF(data, filename) ?? Promise.resolve(),
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
