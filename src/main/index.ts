/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'path'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'
const { app, BrowserWindow, globalShortcut, protocol } = require('electron')
const WindowStateKeeper = require('electron-window-state')
dotenv.config({ path: join(__dirname, '../../.env') })

const isDev = is_dev
const isDevTools = is_dev

let mainWindow: any

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

function createWindow(windowName = 'main', options = {}) {
  const winOptions = {
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    trafficLightPosition: {
      x: 20,
      y: 32,
    },
    ...options,
  }

  const windowState = WindowStateKeeper({
    defaultWidth: winOptions.minWidth,
    defaultHeight: winOptions.minHeight,
  })

  const win = new BrowserWindow({
    ...winOptions,
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
  })
  windowState.manage(win)

  win.once('ready-to-show', () => {
    win.show()
    win.focus()
  })
  return win
}

async function createMainWindow() {
  mainWindow = createWindow('main', {
    icon: 'public/icon.ico',
    webPreferences: {
      devTools: isDevTools,
      spellcheck: false,
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.js'),
      // 取消跨域限制
      webSecurity: false,
      enableRemoteModule: true,
    },
    // backgroundColor: fullTailwindConfig.theme.colors.primary[800],
  })
  mainWindow.once('close', () => {
    mainWindow = null
  })
  const port = process.env.PORT || 3000
  const url = isDev
    ? `http://localhost:${port}`
    : `file://${__dirname}/../render/index.html`

  mainWindow.loadURL(url)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow()
  if (isDevTools) {
    globalShortcut.register('CommandOrControl+Shift+i', () => {
      mainWindow.webContents.openDevTools()
    })
  }
})
// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  if (!mainWindow) createMainWindow()
})

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// Exit cleanly on request from parent process in development mode.
if (isDev) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') app.quit()
    })
  }
  else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
