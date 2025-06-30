// Types pour l'API Electron exposée
export interface ElectronAPI {
  navigateToUrl: (url: string) => Promise<void>;
  onNavigateTo: (callback: (url: string) => void) => void;
  onNavigate: (callback: (direction: string) => void) => void;
  onShowAddressBar: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
  // Nouvelle méthode pour naviguer depuis la page d'accueil
  navigateFromHome: (url: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
