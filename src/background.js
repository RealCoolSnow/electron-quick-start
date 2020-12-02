/* eslint-disable @typescript-eslint/no-var-requires */
const { app, globalShortcut, protocol } = require('electron')
const createWindow = require('./helpers/create-window.js')
// const contextMenu = require('electron-context-menu')

// const resolveConfig = require('tailwindcss/resolveConfig')
// const tailwindConfig = require('../tailwind.config.js')
// const fullTailwindConfig = resolveConfig(tailwindConfig)

// contextMenu({
//   showSearchWithGoogle: false,
//   showCopyImage: false,
//   prepend: (defaultActions, params, browserWindow) => [
//     {
//       label: 'quick start',
//     },
//   ],
// })

const isDev = !app.isPackaged

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

let mainWindow

function createMainWindow() {
  mainWindow = createWindow('main', {
    // backgroundColor: fullTailwindConfig.theme.colors.primary[800],
  })
  mainWindow.once('close', () => {
    mainWindow = null
  })

  const port = process.env.PORT || 3000
  if (isDev) {
    mainWindow.loadURL(`http://localhost:${port}`)
    setTimeout(() => mainWindow.loadURL(`http://localhost:${port}`), 1000)
    globalShortcut.register('CommandOrControl+Shift+i', () => {
      mainWindow.webContents.openDevTools()
    })
  } else {
    mainWindow.loadFile('dist/index.html')
  }
}

app.once('ready', createMainWindow)
app.on('activate', () => {
  if (!mainWindow) createMainWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Exit cleanly on request from parent process in development mode.
if (isDev) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') app.quit()
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
