import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
import scss from 'rollup-plugin-scss'

const globals = {
  vue: 'Vue',
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: pkg.name,
        file: pkg.main,
        format: 'umd',
        globals,
        plugins: [terser()],
      },
      {
        file: pkg.module,
        format: 'es',
        plugins: [terser()],
      },
      {
        name: pkg.name,
        file: pkg.unpkg,
        format: 'umd',
        plugins: [terser()],
        globals,
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
        extensions,
        plugins: ['@vue/babel-plugin-jsx'],
      }),
      commonjs({ extensions: ['.ts', '.js', '.tsx'] }),
    ],
  },
]
