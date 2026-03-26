import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';

const external = [
  'grapesjs',
  'html2canvas',
  'jspdf',
  'vue',
  'react',
  'react-dom',
  'react/jsx-runtime',
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  // ── Core (CJS + ESM) ─────────────────────────────────────
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true, exports: 'named' },
      { file: 'dist/index.esm.js', format: 'es', sourcemap: true },
    ],
    external,
    plugins: [
      vue(),
      postcss(),
      esbuild({ target: 'es2020', jsx: 'automatic' }),
      resolve({ extensions: ['.ts', '.tsx', '.js', '.vue'] }),
      commonjs(),
    ],
  },

  // ── React adapter (CJS + ESM) ────────────────────────────
  {
    input: 'src/adapters/react/index.ts',
    output: [
      { file: 'dist/react/index.cjs.js', format: 'cjs', sourcemap: true, exports: 'named' },
      { file: 'dist/react/index.esm.js', format: 'es', sourcemap: true },
    ],
    external: [...external, 'cert-builder'],
    plugins: [
      esbuild({ target: 'es2020', jsx: 'automatic' }),
      resolve({ extensions: ['.ts', '.tsx', '.js'] }),
      commonjs(),
    ],
  },
];
