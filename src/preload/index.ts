import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('browser', {
  navigate: (url: string): void => {
    ipcRenderer.send('navigate', url)
  },
  goBack: (): void => {
    ipcRenderer.send('go-back')
  },
  goForward: (): void => {
    ipcRenderer.send('go-forward')
  },
  reload: (): void => {
    ipcRenderer.send('reload')
  },
  stop: (): void => {
    ipcRenderer.send('stop')
  },
  getUrl: (): Promise<string> => {
    return ipcRenderer.invoke('get-url')
  },
  canGoBack: (): Promise<boolean> => {
    return ipcRenderer.invoke('can-go-back')
  },
  canGoForward: (): Promise<boolean> => {
    return ipcRenderer.invoke('can-go-forward')
  },
  onUrlChanged: (callback: (url: string) => void): void => {
    ipcRenderer.on('url-changed', (_event, url: string) => {
      callback(url)
    })
  }
})
