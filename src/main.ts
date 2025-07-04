import { app, BrowserWindow, globalShortcut, ipcMain, Menu, IpcMainInvokeEvent, MenuItemConstructorOptions } from 'electron';
import { join } from 'path';

class MinimalBrowser {
  private windows: Set<BrowserWindow> = new Set();
  private pipWindows: Map<string, BrowserWindow> = new Map(); // Gestion des fenêtres PiP
  private static instance: MinimalBrowser;
  private pendingUrls: string[] = []; // File d'attente pour les URLs reçues avant que l'app soit prête
  private isAppReady: boolean = false;

  constructor() {
    MinimalBrowser.instance = this;
    this.initializeApp();
  }

  public static getInstance(): MinimalBrowser {
    return MinimalBrowser.instance;
  }

  private initializeApp(): void {
    // Configurer le dossier de données utilisateur
    app.setPath('userData', join(app.getPath('userData'), 'NavWeb'));
    
    // Définir l'app comme gestionnaire par défaut pour le protocole navweb://
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('navweb', process.execPath, [join(__dirname, '..')]);
      }
    } else {
      app.setAsDefaultProtocolClient('navweb');
    }
    
    // Gérer les URLs passées en argument au démarrage
    const url = this.getUrlFromArgs(process.argv);
    
    app.whenReady().then(() => {
      this.isAppReady = true;
      this.setupMenu();
      this.registerGlobalShortcuts();
      
      // Traiter les URLs en attente en premier
      const hasPendingUrls = this.pendingUrls.length > 0;
      this.processPendingUrls();
      
      // Si une URL est fournie au démarrage, créer une fenêtre de navigateur directement
      if (url) {
        this.openBrowserWindow(url);
      } else if (!hasPendingUrls && this.windows.size === 0) {
        // Ne créer une fenêtre d'accueil que s'il n'y a pas d'URLs en attente et aucune fenêtre
        this.createWindow();
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // Ne créer une nouvelle fenêtre que s'il n'y a vraiment aucune fenêtre
      if (BrowserWindow.getAllWindows().length === 0) {
        console.log('📱 Activation app - création fenêtre d\'accueil');
        this.createWindow();
      } else {
        console.log('📱 Activation app - fenêtres existantes, pas de création');
      }
    });

    app.on('will-quit', () => {
      if (this.isAppReady) {
        globalShortcut.unregisterAll();
      }
    });

    // Gérer l'ouverture de liens externes sur macOS
    app.on('open-url', (event, url) => {
      event.preventDefault();
      console.log('🌐 Événement open-url reçu:', url);
      
      if (!this.isAppReady) {
        console.log('⏳ App pas encore prête, mise en file d\'attente de l\'URL:', url);
        this.pendingUrls.push(url);
        return;
      }
      
      const cleanUrl = this.cleanProtocolUrl(url);
      if (cleanUrl) {
        console.log('🚀 Ouverture de fenêtre navigateur avec:', cleanUrl);
        this.openBrowserWindow(cleanUrl);
      } else {
        console.log('❌ URL invalide après nettoyage');
      }
    });

    // Gérer les instances multiples (Windows/Linux)
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      console.log('🔄 Seconde instance détectée avec commandLine:', commandLine);
      
      if (!this.isAppReady) {
        console.log('⏳ App pas encore prête pour second-instance');
        return;
      }
      
      const url = this.getUrlFromArgs(commandLine);
      if (url) {
        console.log('🚀 Ouverture de fenêtre navigateur avec:', url);
        this.openBrowserWindow(url);
      } else {
        console.log('📋 Aucune URL - gestion fenêtre existante');
        // Créer une nouvelle fenêtre ou ramener la fenêtre existante au premier plan
        if (this.windows.size === 0) {
          this.createWindow();
        } else {
          const firstWindow = Array.from(this.windows)[0];
          if (firstWindow.isMinimized()) firstWindow.restore();
          firstWindow.focus();
        }
      }
    });

    // Empêcher les instances multiples (optionnel)
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      app.quit();
    }
  }

  // Traiter les URLs reçues avant que l'app soit prête
  private processPendingUrls(): void {
    console.log('📋 Traitement des URLs en attente:', this.pendingUrls);
    
    while (this.pendingUrls.length > 0) {
      const url = this.pendingUrls.shift();
      if (url) {
        const cleanUrl = this.cleanProtocolUrl(url);
        if (cleanUrl) {
          console.log('🚀 Ouverture de fenêtre navigateur en différé avec:', cleanUrl);
          this.openBrowserWindow(cleanUrl);
        }
      }
    }
  }

  // Méthode pour extraire l'URL des arguments de ligne de commande
  private getUrlFromArgs(argv: string[]): string | null {
    console.log('🔍 Arguments reçus:', argv);
    
    // Chercher un argument qui ressemble à une URL
    for (const arg of argv) {
      console.log('🔎 Examen de l\'argument:', arg);
      
      if (arg.startsWith('navweb://')) {
        const cleanUrl = this.cleanProtocolUrl(arg);
        console.log('✅ URL navweb:// trouvée et nettoyée:', cleanUrl);
        return cleanUrl;
      }
      // Aussi accepter les URLs HTTP/HTTPS directes
      if (arg.startsWith('http://') || arg.startsWith('https://')) {
        console.log('✅ URL HTTP(S) directe trouvée:', arg);
        return arg;
      }
    }
    
    console.log('❌ Aucune URL trouvée dans les arguments');
    return null;
  }

  // Méthode pour nettoyer l'URL du protocole personnalisé
  private cleanProtocolUrl(url: string): string | null {
    console.log('🧹 Nettoyage de l\'URL:', url);
    
    if (url.startsWith('navweb://')) {
      // Extraire l'URL après navweb://
      const cleanUrl = url.replace('navweb://', '');
      console.log('🔗 URL extraite:', cleanUrl);
      
      // Si l'URL ne commence pas par http/https, ajouter https://
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        const finalUrl = `https://${cleanUrl}`;
        console.log('🔧 URL finale avec https://', finalUrl);
        return finalUrl;
      }
      console.log('✅ URL finale:', cleanUrl);
      return cleanUrl;
    }
    
    console.log('➡️ URL retournée telle quelle:', url);
    return url;
  }

  private createWindow(url: string = ''): BrowserWindow {
    // Utiliser la barre de titre par défaut pour les URLs, hiddenInset seulement pour la page d'accueil
    const titleBarStyle = url ? 'default' : 'hiddenInset';
    const trafficLightPosition = url ? undefined : { x: 20, y: 15 };
    
    const window = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 400,
      minHeight: 300,
      titleBarStyle: titleBarStyle,
      trafficLightPosition: trafficLightPosition,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webviewTag: true,
        preload: join(__dirname, 'preload.js'),
        webSecurity: false,
        partition: 'persist:main',
        allowRunningInsecureContent: true
      },
      show: false
    });

    // Supprimer complètement la barre de menu de la fenêtre
    window.setMenu(null);

    // Charger la page d'accueil ou l'URL spécifiée
    if (url) {
      window.loadURL(url);
    } else {
      window.loadFile(join(__dirname, '../src/renderer/home.html'));
    }

    // Afficher la fenêtre une fois prête
    window.once('ready-to-show', () => {
      window.show();
      window.focus();
    });

    // Gérer les demandes de navigation depuis la page d'accueil
    // (Supprimé will-navigate car

    // Gérer les nouveaux onglets/fenêtres
    window.webContents.setWindowOpenHandler(({ url: newUrl }) => {
      this.openBrowserWindow(newUrl);
      return { action: 'deny' };
    });
    window.on('closed', () => {
      this.windows.delete(window);
    });

    // Ajouter la fenêtre à notre collection
    this.windows.add(window);

    // Envoyer l'URL à charger (seulement si une URL spécifique est fournie)
    if (url) {
      window.webContents.once('dom-ready', () => {
        window.webContents.send('navigate-to', url);
      });
    }

    return window;
  }

  private openBrowserWindow(url: string): BrowserWindow {
    console.log('🖥️ Création fenêtre navigateur pour URL:', url);
    
    // Vérification de sécurité : s'assurer que l'app est prête
    if (!this.isAppReady) {
      console.log('❌ Tentative de création de fenêtre avant que l\'app soit prête');
      throw new Error('Cannot create BrowserWindow before app is ready');
    }
    
    const browserWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 400,
      minHeight: 300,
      titleBarStyle: 'default', // Barre de titre native macOS pour les pages web
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webviewTag: true,
        preload: join(__dirname, 'preload.js'),
        webSecurity: false,
        partition: 'persist:main',
        allowRunningInsecureContent: true
      },
      show: false
    });

    // Supprimer complètement la barre de menu de la fenêtre
    browserWindow.setMenu(null);

    // Charger la page du navigateur
    browserWindow.loadFile(join(__dirname, '../src/renderer/index.html'));

    // Afficher la fenêtre une fois prête
    browserWindow.once('ready-to-show', () => {
      console.log('✅ Fenêtre navigateur prête à être affichée');
      browserWindow.show();
      browserWindow.focus();
    });

    // Gérer la fermeture de la fenêtre
    browserWindow.on('closed', () => {
      this.windows.delete(browserWindow);
    });

    // Ajouter la fenêtre à notre collection
    this.windows.add(browserWindow);

    // Envoyer l'URL à charger
    browserWindow.webContents.once('dom-ready', () => {
      console.log('📤 Envoi navigate-to avec URL:', url);
      browserWindow.webContents.send('navigate-to', url);
    });

    return browserWindow;
  }

  private setupMenu(): void {
    // Menu application minimal pour macOS
    const template: MenuItemConstructorOptions[] = [
      {
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Édition',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'Fenêtre',
        submenu: [
          {
            label: 'Nouvelle fenêtre',
            accelerator: 'CmdOrCtrl+T',
            click: () => this.handleNewWindow()
          },
          {
            label: 'Fermer fenêtre',
            accelerator: 'CmdOrCtrl+W',
            click: () => this.handleCloseWindow()
          },
          { type: 'separator' },
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private registerGlobalShortcuts(): void {
    if (!app.isReady()) {
      console.log('⚠️ App pas encore prête, report de l\'enregistrement des raccourcis');
      return;
    }
    
    console.log('⌨️ Enregistrement des raccourcis globaux');
    
    // CMD+T pour nouvelle fenêtre
    globalShortcut.register('CmdOrCtrl+T', () => {
      this.handleNewWindow();
    });

    // CMD+W pour fermer fenêtre
    globalShortcut.register('CmdOrCtrl+W', () => {
      this.handleCloseWindow();
    });

    // CMD+L pour afficher la barre d'URL
    globalShortcut.register('CmdOrCtrl+L', () => {
      this.handleShowAddressBar();
    });

    // Navigation
    globalShortcut.register('CmdOrCtrl+Left', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.webContents.send('navigate', 'back');
      }
    });

    globalShortcut.register('CmdOrCtrl+Right', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.webContents.send('navigate', 'forward');
      }
    });

    globalShortcut.register('CmdOrCtrl+R', () => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        focusedWindow.webContents.send('navigate', 'reload');
      }
    });
  }

  private handleNewWindow(): void {
    // Ouvrir une nouvelle page d'accueil
    this.createWindow();
  }

  private handleCloseWindow(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.close();
    }
  }

  private handleShowAddressBar(): void {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      // Vérifier si c'est une fenêtre de navigation (avec webview) ou d'accueil
      const url = focusedWindow.webContents.getURL();
      
      if (url.includes('index.html')) {
        // Fenêtre de navigation - afficher la barre d'URL
        focusedWindow.webContents.send('show-address-bar');
      } else if (url.includes('home.html')) {
        // Fenêtre d'accueil - focus sur la barre de recherche
        focusedWindow.webContents.executeJavaScript(`
          const searchInput = document.querySelector('.search-input');
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        `);
      } else {
        // Tentative d'envoi du message quand même
        focusedWindow.webContents.send('show-address-bar');
      }
    }
  }

  // Méthodes pour gérer le Picture-in-Picture
  public createPipWindow(videoSrc: string, videoTitle: string = 'Video'): BrowserWindow {
    const pipWindow = new BrowserWindow({
      width: 400,
      height: 300,
      minWidth: 200,
      minHeight: 150,
      alwaysOnTop: true,
      frame: false,
      resizable: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, 'preload.js'),
        webSecurity: false,
        allowRunningInsecureContent: true
      },
      title: videoTitle,
      show: false
    });

    // Créer le contenu HTML pour la fenêtre PiP
    const pipHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: black;
          overflow: hidden;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .controls:hover {
          opacity: 1;
        }
        body:hover .controls {
          opacity: 1;
        }
        button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px;
          border-radius: 3px;
        }
        button:hover {
          background: rgba(255,255,255,0.2);
        }
        .time {
          color: white;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }
        .progress {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          cursor: pointer;
        }
        .progress-bar {
          height: 100%;
          background: #ff0000;
          border-radius: 2px;
          width: 0%;
          transition: width 0.1s;
        }
      </style>
    </head>
    <body>
      <video id="pipVideo" controls autoplay>
        <source src="${videoSrc}" type="video/mp4">
        Votre navigateur ne supporte pas la balise vidéo.
      </video>
      <div class="controls">
        <button onclick="togglePlayPause()">⏯️</button>
        <span class="time">
          <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
        </span>
        <div class="progress" onclick="seek(event)">
          <div class="progress-bar" id="progressBar"></div>
        </div>
        <button onclick="toggleMute()">🔊</button>
        <button onclick="closePip()">❌</button>
      </div>
      <script>
        const video = document.getElementById('pipVideo');
        const progressBar = document.getElementById('progressBar');
        const currentTimeSpan = document.getElementById('currentTime');
        const durationSpan = document.getElementById('duration');
        
        function formatTime(seconds) {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
        
        function togglePlayPause() {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
        
        function toggleMute() {
          video.muted = !video.muted;
        }
        
        function seek(event) {
          const progress = document.querySelector('.progress');
          const rect = progress.getBoundingClientRect();
          const percent = (event.clientX - rect.left) / rect.width;
          video.currentTime = percent * video.duration;
        }
        
        function closePip() {
          window.electronAPI.closePip();
        }
        
        video.addEventListener('timeupdate', () => {
          if (video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            progressBar.style.width = percent + '%';
            currentTimeSpan.textContent = formatTime(video.currentTime);
          }
        });
        
        video.addEventListener('loadedmetadata', () => {
          durationSpan.textContent = formatTime(video.duration);
        });
        
        // Double-clic pour basculer en plein écran
        video.addEventListener('dblclick', () => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            video.requestFullscreen();
          }
        });
      </script>
    </body>
    </html>`;

    // Charger le contenu HTML
    pipWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(pipHtml)}`);

    pipWindow.once('ready-to-show', () => {
      pipWindow.show();
    });

    pipWindow.on('closed', () => {
      this.pipWindows.delete(videoSrc);
    });

    // Ajouter à la collection des fenêtres PiP
    this.pipWindows.set(videoSrc, pipWindow);

    return pipWindow;
  }

  public closePipWindow(videoSrc: string): void {
    const pipWindow = this.pipWindows.get(videoSrc);
    if (pipWindow) {
      pipWindow.close();
      this.pipWindows.delete(videoSrc);
    }
  }

  public convertToBrowserWindow(window: BrowserWindow, url: string): void {
    // Changer le style de la barre de titre pour utiliser la barre par défaut de macOS
    // Note: setTitleBarOverlay et autres méthodes ne permettent pas de changer dynamiquement titleBarStyle
    // On doit recréer la fenêtre avec les bonnes propriétés
    const bounds = window.getBounds();
    const isMaximized = window.isMaximized();
    const isMinimized = window.isMinimized();
    
    // Fermer l'ancienne fenêtre
    this.windows.delete(window);
    window.close();
    
    // Créer une nouvelle fenêtre avec la barre de titre par défaut
    const newWindow = new BrowserWindow({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      minWidth: 400,
      minHeight: 300,
      titleBarStyle: 'default', // Barre de titre par défaut pour les pages web
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webviewTag: true,
        preload: join(__dirname, 'preload.js'),
        webSecurity: false,
        partition: 'persist:main',
        allowRunningInsecureContent: true
      },
      show: false
    });

    // Supprimer complètement la barre de menu de la fenêtre
    newWindow.setMenu(null);
    
    // Ajouter la nouvelle fenêtre à notre collection
    this.windows.add(newWindow);
    
    // Gérer la fermeture de la fenêtre
    newWindow.on('closed', () => {
      this.windows.delete(newWindow);
    });

    // Gérer les nouveaux onglets/fenêtres
    newWindow.webContents.setWindowOpenHandler(({ url: newUrl }) => {
      this.openBrowserWindow(newUrl);
      return { action: 'deny' };
    });
    
    // Charger la page du navigateur avec WebView
    newWindow.loadFile(join(__dirname, '../src/renderer/index.html'));
    
    // Une fois chargée, naviguer vers l'URL et afficher la fenêtre
    newWindow.webContents.once('dom-ready', () => {
      newWindow.webContents.send('navigate-to', url);
    });
    
    // Afficher la nouvelle fenêtre
    newWindow.once('ready-to-show', () => {
      newWindow.show();
      if (isMaximized) {
        newWindow.maximize();
      } else if (isMinimized) {
        newWindow.minimize();
      }
      newWindow.focus();
    });
  }
}

// IPC handlers
ipcMain.handle('navigate-to-url', async (event: IpcMainInvokeEvent, url: string) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.webContents.send('navigate-to', url);
  }
});

// Nouveau handler pour la navigation depuis la page d'accueil
ipcMain.handle('navigate-from-home', async (event: IpcMainInvokeEvent, url: string) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    MinimalBrowser.getInstance().convertToBrowserWindow(window, url);
  }
});

// Handlers pour Picture-in-Picture
ipcMain.handle('create-pip-window', async (event: IpcMainInvokeEvent, videoSrc: string, videoTitle?: string) => {
  try {
    const pipWindow = MinimalBrowser.getInstance().createPipWindow(videoSrc, videoTitle);
    return { success: true, windowId: pipWindow.id };
  } catch (error: any) {
    console.error('Erreur lors de la création de la fenêtre PiP:', error);
    return { success: false, error: error.message || 'Erreur inconnue' };
  }
});

ipcMain.handle('close-pip-window', async (event: IpcMainInvokeEvent, videoSrc: string) => {
  try {
    MinimalBrowser.getInstance().closePipWindow(videoSrc);
    return { success: true };
  } catch (error: any) {
    console.error('Erreur lors de la fermeture de la fenêtre PiP:', error);
    return { success: false, error: error.message || 'Erreur inconnue' };
  }
});

ipcMain.handle('close-pip', async (event: IpcMainInvokeEvent) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

// Démarrer l'application
new MinimalBrowser();
