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
        
        /* Styles pour les contrôles PiP */
        .pip-button {
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          background: rgba(0, 0, 0, 0.7) !important;
          color: white !important;
          border: none !important;
          padding: 8px 12px !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          font-size: 12px !important;
          z-index: 9999 !important;
          opacity: 0 !important;
          transition: opacity 0.3s !important;
        }
        
        .pip-button:hover {
          background: rgba(0, 0, 0, 0.9) !important;
          opacity: 1 !important;
        }
        
        video:hover + .pip-button,
        .pip-button:hover {
          opacity: 1 !important;
        }
        
        .video-container {
          position: relative !important;
        }
        
        .video-container:hover .pip-button {
          opacity: 1 !important;
        }
      `);
      
      // Injecter le script pour détecter et ajouter les boutons PiP aux vidéos
      this.webview.executeJavaScript(`
        (function() {
          let pipButtons = new Set();
          
          function createPipButton(video) {
            const button = document.createElement('button');
            button.className = 'pip-button';
            button.textContent = '📺 PiP';
            button.title = 'Ouvrir en Picture-in-Picture';
            
            button.addEventListener('click', async (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              const videoSrc = video.src || video.currentSrc;
              const videoTitle = document.title || 'Vidéo';
              
              if (videoSrc) {
                try {
                  // Utiliser l'API native PiP si disponible
                  if (video.requestPictureInPicture && document.pictureInPictureEnabled) {
                    await video.requestPictureInPicture();
                  } else {
                    // Fallback vers notre fenêtre PiP personnalisée
                    window.electronAPI?.createPipWindow(videoSrc, videoTitle);
                  }
                } catch (error) {
                  console.error('Erreur PiP:', error);
                  // Fallback vers notre fenêtre PiP personnalisée
                  window.electronAPI?.createPipWindow(videoSrc, videoTitle);
                }
              }
            });
            
            return button;
          }
          
          function addPipButtonToVideo(video) {
            if (pipButtons.has(video)) return;
            
            const button = createPipButton(video);
            pipButtons.add(video);
            
            // Essayer de trouver un conteneur parent approprié
            let container = video.parentElement;
            while (container && !container.style.position && container !== document.body) {
              container = container.parentElement;
            }
            
            if (!container || container === document.body) {
              container = video.parentElement;
            }
            
            // S'assurer que le conteneur a une position relative
            if (container) {
              container.style.position = container.style.position || 'relative';
              container.classList.add('video-container');
              container.appendChild(button);
            }
          }
          
          function scanForVideos() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
              if (video.src || video.currentSrc) {
                addPipButtonToVideo(video);
              }
            });
          }
          
          // Scanner initialement
          scanForVideos();
          
          // Scanner périodiquement pour les nouvelles vidéos
          setInterval(scanForVideos, 2000);
          
          // Observer les changements du DOM
          const observer = new MutationObserver(() => {
            scanForVideos();
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        })();
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
