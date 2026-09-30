import { app, BaseWindow, Menu, WebContentsView, ipcMain } from 'electron'
import path from 'node:path'

let win: BaseWindow | null = null
let uiView: WebContentsView | null = null
let webView: WebContentsView | null = null

const TOOLBAR_HEIGHT = 49

function createWindow(): void {
  Menu.setApplicationMenu(null)

  win = new BaseWindow({
    width: 1200,
    height: 800,
    title: 'SkyBrowser'
  })

  const preloadPath = path.join(__dirname, '../preload/index.js')

  webView = new WebContentsView()

  uiView = new WebContentsView({
    webPreferences: {
      preload: preloadPath
    }
  })

  win.contentView.addChildView(webView)
  win.contentView.addChildView(uiView)

  const rendererUrl = process.env.ELECTRON_RENDERER_URL

  if (rendererUrl) {
    void uiView.webContents.loadURL(rendererUrl)
  } else {
    void uiView.webContents.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  void webView.webContents.loadURL('https://search.brave.com')

  updateBounds()

  win.on('resize', (): void => {
    updateBounds()
  })

  webView.webContents.on('did-navigate', (_event, url): void => {
    uiView?.webContents.send('url-changed', url)
  })

  webView.webContents.on('did-navigate-in-page', (_event, url): void => {
    uiView?.webContents.send('url-changed', url)
  })

  webView.webContents.on('page-title-updated', (_event, title): void => {
    win?.setTitle(`${title} - SkyBrowser`)
  })

  uiView.webContents.on('console-message', (_event, level, message): void => {
    console.log(`[UI ${level}] ${message}`)
  })

  uiView.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL): void => {
    console.error(`[UI LOAD ERROR] ${errorCode} ${errorDescription} ${validatedURL}`)
  })

  win.on('closed', (): void => {
    uiView?.webContents.close()
    webView?.webContents.close()

    uiView = null
    webView = null
    win = null
  })
}

function updateBounds(): void {
  if (!win || !uiView || !webView) {
    return
  }

  const { width, height } = win.getContentBounds()

  webView.setBounds({
    x: 0,
    y: TOOLBAR_HEIGHT,
    width,
    height: Math.max(0, height - TOOLBAR_HEIGHT)
  })

  uiView.setBounds({
    x: 0,
    y: 0,
    width,
    height: TOOLBAR_HEIGHT
  })

  win.contentView.addChildView(uiView)
}

ipcMain.on('navigate', (_event, url: string): void => {
  if (!webView) {
    return
  }

  let finalUrl = url.trim()

  if (!finalUrl) {
    return
  }

  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    if (finalUrl.includes('.')) {
      finalUrl = `https://${finalUrl}`
    } else {
      finalUrl = `https://search.brave.com/search?q=${encodeURIComponent(finalUrl)}`
    }
  }

  void webView.webContents.loadURL(finalUrl)
})

ipcMain.on('go-back', (): void => {
  if (webView?.webContents.canGoBack()) {
    webView.webContents.goBack()
  }
})

ipcMain.on('go-forward', (): void => {
  if (webView?.webContents.canGoForward()) {
    webView.webContents.goForward()
  }
})

ipcMain.on('reload', (): void => {
  webView?.webContents.reload()
})

ipcMain.on('stop', (): void => {
  webView?.webContents.stop()
})

ipcMain.handle('get-url', (): string => {
  return webView?.webContents.getURL() ?? ''
})

ipcMain.handle('can-go-back', (): boolean => {
  return webView?.webContents.canGoBack() ?? false
})

ipcMain.handle('can-go-forward', (): boolean => {
  return webView?.webContents.canGoForward() ?? false
})

app.whenReady().then((): void => {
  createWindow()
})

app.on('window-all-closed', (): void => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', (): void => {
  if (!win) {
    createWindow()
  }
})
