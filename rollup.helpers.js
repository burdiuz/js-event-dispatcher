import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export const DESTINATION_FOLDER = 'dist';

const copyPlugin = copy({
  targets: [
    { src: 'LICENSE', dest: DESTINATION_FOLDER },
    { src: 'README.md', dest: DESTINATION_FOLDER },
    { src: 'package.json', dest: DESTINATION_FOLDER },
    { src: 'package-lock.json', dest: DESTINATION_FOLDER },
    { src: 'SKILL.md', dest: DESTINATION_FOLDER },
  ],
});

export const plugins = [
  resolve(),
  typescript({ tsconfig: './tsconfig.json' }),
  commonjs(),
];

export const cjsConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: `${DESTINATION_FOLDER}/index.js`,
      sourcemap: true,
      exports: 'named',
      format: 'cjs',
    },
  ],
  plugins: [...plugins, copyPlugin],
};

const makeUMDConfig = (suffix = '', additionalPlugins = []) => ({
  input: 'src/index.ts',
  output: [
    {
      file: `${DESTINATION_FOLDER}/event-dispatcher${suffix}.js`,
      sourcemap: true,
      exports: 'named',
      name: 'EventDispatcher',
      format: 'umd',
    },
  ],
  plugins: [...plugins, ...additionalPlugins],
});

export const umdConfig = makeUMDConfig();

export const umdMinConfig = makeUMDConfig('.min', [terser()]);
