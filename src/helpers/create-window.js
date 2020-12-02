/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')

const isProd = app.isPackaged

module.exports = function createWindow(windowName = 'main', options = {}) {
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
    webPreferences: {
      devTools: !isProd,
      spellcheck: false,
      nodeIntegration: true,
      ...(options.webPreferences || {}),
    },
  }

  const windowState = windowStateKeeper({
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
