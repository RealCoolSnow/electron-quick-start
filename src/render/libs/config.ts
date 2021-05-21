import _Store from 'electron-store'
import { formatTime } from '../utils/util'

/**
 * 存储路径:
 * app.getPath('userData')\AppData\Roaming\app-name\config.json
 */
class _Config {
  store: any
  constructor() {
    const schema = {
      debug: {
        type: 'boolean',
        default: false,
      },
      cwd: {
        type: 'string',
        default: '',
      },
    }
    this.store = new _Store(/* { schema } */)
    this.store.set('launch_time', formatTime(new Date()))
    console.log('config path: ', this.store.path)
    this._init()
    console.log('config data: ', this.store.store)
  }

  _init() {
    this._setDefaultValue('debug', false)
    this._setDefaultValue2('cwd', process.cwd(), true)
  }

  _setDefaultValue(key: string, value: any) {
    if (!this.has(key))
      this.set(key, value)
  }

  _setDefaultValue2(key: string, value: any, resetFlag: boolean) {
    if (resetFlag || !this.has(key))
      this.set(key, value)
  }

  isDebug() {
    return this.get('debug', false)
  }

  set(key: string, value: any) {
    this.store.set(key, value)
  }

  get(key: string, defaultValue: any) {
    return this.store.get(key, defaultValue)
  }

  has(key: string) {
    return this.store.has(key)
  }

  delete(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}
const Config = new _Config()
export {
  Config,
}
