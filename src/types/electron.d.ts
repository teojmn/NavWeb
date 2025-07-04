// Types pour l'API Electron exposée
export interface ElectronAPI {
  navigateToUrl: (url: string) => Promise<void>;
  onNavigateTo: (callback: (url: string) => void) => void;
  onNavigate: (callback: (direction: string) => void) => void;
  onShowAddressBar: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
  // Nouvelle méthode pour naviguer depuis la page d'accueil
  navigateFromHome: (url: string) => Promise<void>;
  // Méthodes Picture-in-Picture
  createPipWindow: (videoSrc: string, videoTitle?: string) => Promise<{success: boolean, windowId?: number, error?: string}>;
  closePipWindow: (videoSrc: string) => Promise<{success: boolean, error?: string}>;
  closePip: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
