const path = require('path')
const { external } = require('../package.json')
/**
 * Vite shared config, assign alias and root dir
 * @type {import('vite').UserConfig}
 */

const config = {
  root: path.join(__dirname, '../src/renderer'),
  base: '', // has to set to empty string so the html assets path will be relative
  alias: {
    '/@/': path.resolve(__dirname, '../src/renderer'),
  },
  esbuildTarget: 'es2015',
  optimizeDeps: {
    exclude: external
  }
}

module.exports = config
