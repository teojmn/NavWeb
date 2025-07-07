import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// API exposée au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  navigateToUrl: (url: string) => ipcRenderer.invoke('navigate-to-url', url),
  
  // Listeners pour les événements du main process
  onNavigateTo: (callback: (url: string) => void) => {
    ipcRenderer.on('navigate-to', (_: IpcRendererEvent, url: string) => callback(url));
  },
  
  onNavigate: (callback: (direction: string) => void) => {
    ipcRenderer.on('navigate', (_: IpcRendererEvent, direction: string) => callback(direction));
  },
  
  onShowAddressBar: (callback: () => void) => {
    ipcRenderer.on('show-address-bar', () => callback());
  },
  
  // Nouvelle méthode pour naviguer depuis la page d'accueil
  navigateFromHome: (url: string) => ipcRenderer.invoke('navigate-from-home', url),
  
  // Méthode pour récupérer le fond d'écran macOS
  getMacOSWallpaper: () => ipcRenderer.invoke('get-macos-wallpaper'),
  refreshMacOSWallpaper: () => ipcRenderer.invoke('refresh-macos-wallpaper'),
  
  // Méthodes Picture-in-Picture
  createPipWindow: (videoSrc: string, videoTitle?: string) => 
    ipcRenderer.invoke('create-pip-window', videoSrc, videoTitle),
  
  closePipWindow: (videoSrc: string) => 
    ipcRenderer.invoke('close-pip-window', videoSrc),
  
  closePip: () => ipcRenderer.invoke('close-pip'),
  
  // Nettoyage des listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
