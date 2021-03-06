import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import scss from 'rollup-plugin-scss'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

const globals = {
  vue: 'Vue',
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      scss({
        output: 'dist/styles/index.css',
        outputStyle: 'compressed',
      }),
      typescript({
        sourceMap: true,
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.tsx'],
        plugins: ['@vue/babel-plugin-jsx'],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'rangeCalendar',
        file: pkg.unpkg,
        format: 'umd',
        globals,
        plugins: [terser()],
      },
    ],
    plugins: [
      scss({
        output: 'dist/styles/index.css',
        outputStyle: 'compressed',
      }),
      typescript({
        sourceMap: false,
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.tsx'],
        plugins: ['@vue/babel-plugin-jsx'],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      resolve(),
    ],
  },
]
