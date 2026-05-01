import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

export const cjsConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      sourcemap: true,
      exports: 'named',
      format: 'cjs',
    },
  ],
  plugins: [
    resolve(),
    typescript({ declaration: true, declarationDir: 'dist', rootDir: 'src' }),
    commonjs(),
    json(),
    copy({
      targets: [
        { src: 'LICENSE', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'package.json', dest: 'dist' },
        { src: 'package-lock.json', dest: 'dist' },
        { src: 'SKILL.md', dest: 'dist' },
      ],
    }),
  ],
};
