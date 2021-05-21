import { join, sep } from 'path'
import { UserConfig } from 'vite'
import PurgeIcons from 'vite-plugin-purge-icons'
import { createMockServer } from 'vite-plugin-mock'
import dotenv from 'dotenv'

dotenv.config({ path: join(__dirname, '.env') })

const root = join(__dirname, 'src/render')

const alias = {
  '/@/assets/': join(__dirname, 'src/render/assets'),
  '/@/components/': join(__dirname, 'src/render/components'),
  '/@/pages/': join(__dirname, 'src/render/pages'),
  '/@/store/': join(__dirname, 'src/render/store'),
  '/@/service/': join(__dirname, 'src/render/service'),
  '/@/utils/': join(__dirname, 'src/render/utils'),
}

const config: UserConfig = {
  root,
  port: +process.env.PORT,
  base: './',
  outDir: join(__dirname, 'dist/render'),
  alias,
  plugins: [
    PurgeIcons(),
    createMockServer({
      mockPath: 'mock',
      watchFiles: true,
      localEnabled: process.env.NODE_ENV === 'development',
    }),
  ],
  optimizeDeps: {
    // exclode path and electron-window-state as we are using the node runtime inside the browser
    // and dont wont vite to complain. If you have any issues importing node packages and vite complains,
    // add them here
    exclude: ['path'],
  },
  rollupInputOptions: {
    external: [
      'crypto',
      'assert',
      'fs',
      'util',
      'os',
      'events',
      'child_process',
      'http',
      'https',
      'path',
      'electron',
      'file',
    ],
    plugins: [
      {
        name: '@rollup/plugin-cjs2esm',
        transform(code, filename) {
          if (filename.includes(`${sep}node_modules${sep}`))
            return code

          const cjsRegexp = /(const|let|var)[\n\s]+(\w+)[\n\s]*=[\n\s]*require\(["|'](.+)["|']\)/g
          const res = code.match(cjsRegexp)
          if (res) {
            // const Store = require('electron-store') -> import Store from 'electron-store'
            code = code.replace(cjsRegexp, 'import $2 from \'$3\'')
          }
          return code
        },
      },
    ],
  },
}

export default config
