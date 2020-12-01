import { app, BrowserWindow, Menu, globalShortcut } from 'electron'
import { join } from 'path'
import './dialog'
import { Logger } from './logger'

const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindow: BrowserWindow

async function main() {
  const logger = new Logger()
  logger.initialize(app.getPath('userData'))
  app.whenReady().then(() => {
    createWindow()
  })
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1024,
    webPreferences: {
      preload: join(__static, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  Menu.setApplicationMenu(null)
  // 在开发环境可通过快捷键打开devTools
  if (isDevelopment) {
    globalShortcut.register('CommandOrControl+Shift+i', () => {
      mainWindow.webContents.openDevTools()
    })
  }
  mainWindow.loadURL(__windowUrls.index)
}

// ensure app start as single instance
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

process.nextTick(main)
