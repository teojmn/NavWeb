import '../types/electron';

class BrowserRenderer {
  private webview!: Electron.WebviewTag;
  private addressBar!: HTMLElement;
  private urlInput!: HTMLInputElement;
  private isAddressBarVisible = false;
  private debugElement!: HTMLElement;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.setupElectronListeners();
    this.createDebugElement();
  }

  private createDebugElement(): void {
    // Créer un élément de debug visible
    this.debugElement = document.createElement('div');
    this.debugElement.style.cssText = `
      position: fixed;
      top: 40px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
      max-width: 300px;
      word-wrap: break-word;
    `;
    document.body.appendChild(this.debugElement);
    this.log('Renderer initialized');
  }

  private log(message: string): void {
    console.log(message);
    this.debugElement.textContent = message;
    setTimeout(() => {
      if (this.debugElement.textContent === message) {
        this.debugElement.textContent = '';
      }
    }, 3000);
  }

  private initializeElements(): void {
    this.webview = document.getElementById('webview') as Electron.WebviewTag;
    this.addressBar = document.getElementById('address-bar') as HTMLElement;
    this.urlInput = document.getElementById('url-input') as HTMLInputElement;
  }

  private setupEventListeners(): void {
    // Gestion de la barre d'adresse
    this.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.navigateToUrl(this.urlInput.value);
        this.hideAddressBar();
      } else if (e.key === 'Escape') {
        this.hideAddressBar();
      }
    });

    // Cacher la barre d'adresse si on clique ailleurs
    document.addEventListener('click', (e) => {
      if (this.isAddressBarVisible && !this.addressBar.contains(e.target as Node)) {
        this.hideAddressBar();
      }
    });

    // Gestion du webview
    this.webview.addEventListener('dom-ready', () => {
      // Injecter du CSS pour masquer les éléments de navigation du site
      this.webview.insertCSS(`
        /* Masquer les barres de navigation communes */
        nav, .navbar, .nav-bar, header.main-header,
        .site-header, .page-header, #header, #navigation {
          display: none !important;
        }
      `);
    });

    // Mettre à jour l'URL dans la barre d'adresse quand on navigue
    this.webview.addEventListener('did-navigate', (e: any) => {
      this.log(`WebView navigated to: ${e.url}`);
      this.urlInput.value = e.url;
    });

    this.webview.addEventListener('did-navigate-in-page', (e: any) => {
      this.log(`WebView navigated in page: ${e.url}`);
      this.urlInput.value = e.url;
    });

    this.webview.addEventListener('did-fail-load', (e: any) => {
      this.log(`ERREUR: ${e.errorCode} - ${e.errorDescription}`);
    });

    this.webview.addEventListener('did-start-loading', () => {
      this.log('Chargement commencé...');
    });

    this.webview.addEventListener('did-stop-loading', () => {
      this.log('Chargement terminé');
    });

    // Écouter quand le webview est prêt
    this.webview.addEventListener('dom-ready', () => {
      this.log(`DOM ready: ${this.webview.src}`);
      if (this.webview.src && this.webview.src !== 'about:blank') {
        this.urlInput.value = this.webview.src;
      }
    });
  }

  private setupElectronListeners(): void {
    // Écouter les événements du main process
    window.electronAPI.onNavigateTo((url: string) => {
      this.log(`Received navigate-to: ${url}`);
      this.webview.src = url;
    });

    window.electronAPI.onNavigate((direction: string) => {
      switch (direction) {
        case 'back':
          if (this.webview.canGoBack()) {
            this.webview.goBack();
          }
          break;
        case 'forward':
          if (this.webview.canGoForward()) {
            this.webview.goForward();
          }
          break;
        case 'reload':
          this.webview.reload();
          break;
      }
    });

    window.electronAPI.onShowAddressBar(() => {
      this.showAddressBar();
    });
  }

  private showAddressBar(): void {
    this.isAddressBarVisible = true;
    this.addressBar.classList.remove('hidden');
    this.urlInput.focus();
    this.urlInput.select();
  }

  private hideAddressBar(): void {
    this.isAddressBarVisible = false;
    this.addressBar.classList.add('hidden');
    this.webview.focus();
  }

  private navigateToUrl(input: string): void {
    let url = input.trim();
    
    if (!url) return;

    // Pour le debug, forcer l'utilisation d'un site simple
    if (url === 'instagram.com') {
      url = 'https://www.google.com'; // Test temporaire
      this.log(`TEST: Navigation vers Google au lieu d'Instagram`);
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      this.log(`Navigation vers URL complète: ${url}`);
    } else if (url.includes('.') && !url.includes(' ')) {
      url = `https://${url}`;
      this.log(`Navigation vers domaine: ${url}`);
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      this.log(`Recherche Google: ${url}`);
    }

    this.webview.src = url;
  }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  new BrowserRenderer();
});
