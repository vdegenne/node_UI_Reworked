import typescript from '@rollup/plugin-typescript'
import tsConfig from './tsconfig.json' assert { type: 'json'}
import { readdir, unlink } from 'fs/promises'
import { join } from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import modify from 'rollup-plugin-modify'
import json from '@rollup/plugin-json'

const views = [
  ...(await readdir('./src/views')).map(path => join('./src/views', path)),
  ...(await readdir('./src/views/explorer')).map(path => join('./src/views/explorer', path)),
  ...(await readdir('./src/views/identity')).map(path => join('./src/views/identity', path))
]

// const templates = (await readdir('./src/templates')).map(path => join('./src/templates', path))
const cleanWWW = async () => {
  return {
    name: 'clean-www', // this name will show up in warnings and errors
    generateBundle: async ()=> {
      const files = await readdir('www')
      for (const file of files) {
        if (file.endsWith('.js') && !file.includes('monaco')) await unlink(join('www', file))
        
      }
      return 
    }
  };
  
  
}

export default [{
  input: ['./src/shell.js', ...views, './node_modules/@leofcoin/storage/exports/browser-store.js'],
  output: {
    dir: './www',
    format: 'es'
  },
  external: [
    './identity.js',
    './../../monaco/monaco-loader.js',
    '@monaco-import'
  ],
  plugins: [
    cleanWWW(),
    json(),
    resolve({mainFields: ['browser', 'module', 'main']}),
    commonjs(),
    modify({
      '@monaco-import': './../../monaco/monaco-loader.js',
      './exports/browser/workers/machine-worker.js': './workers/machine-worker.js',
    })
  ]
}, {
  input: './node_modules/@leofcoin/workers/src/machine-worker.js',
  output: {
    file: './www/workers/machine-worker.js',
    format: 'es'
  },

  plugins: [
    json(),
    resolve({
      mainFields: ['module', 'browser']
    }),
    commonjs(),
    modify({
      'node_modules/@leofcoin/workers/src/block-worker.js': './block-worker.js',
    })
  ]
}, {
  input: './node_modules/@leofcoin/workers/src/block-worker.js',
  output: {
    file: './www/workers/block-worker.js',
    format: 'es'
  },
  plugins: [
    json(),
    resolve({
      mainFields: ['module', 'browser']
    }),
    commonjs({exclude: ['simple-peer', './simple-peer.js']})
  ]
}]
