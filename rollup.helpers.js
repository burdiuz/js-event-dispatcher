import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export const cjsConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'index.js',
      sourcemap: true,
      exports: 'named',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve(),
    typescript({ declaration: true, declarationDir: '.', rootDir: 'src' }),
    commonjs(),
    json(),
  ],
};
