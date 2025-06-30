import { app, BrowserWindow, globalShortcut, ipcMain, Menu, IpcMainInvokeEvent, MenuItemConstructorOptions } from 'electron';
import { join } from 'path';

class MinimalBrowser {
  private windows: Set<BrowserWindow> = new Set();
  private static instance: MinimalBrowser;

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
      this.setupMenu();
      this.registerGlobalShortcuts();
      
      // Si une URL est fournie au démarrage, créer une fenêtre de navigateur directement
      if (url) {
        this.openBrowserWindow(url);
      } else {
        this.createWindow();
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    app.on('will-quit', () => {
      globalShortcut.unregisterAll();
    });

    // Gérer l'ouverture de liens externes sur macOS
    app.on('open-url', (event, url) => {
      event.preventDefault();
      const cleanUrl = this.cleanProtocolUrl(url);
      if (cleanUrl) {
        this.openBrowserWindow(cleanUrl);
      }
    });

    // Gérer les instances multiples (Windows/Linux)
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      const url = this.getUrlFromArgs(commandLine);
      if (url) {
        this.openBrowserWindow(url);
      } else {
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

  // Méthode pour extraire l'URL des arguments de ligne de commande
  private getUrlFromArgs(argv: string[]): string | null {
    // Chercher un argument qui ressemble à une URL
    for (const arg of argv) {
      if (arg.startsWith('navweb://')) {
        return this.cleanProtocolUrl(arg);
      }
      // Aussi accepter les URLs HTTP/HTTPS directes
      if (arg.startsWith('http://') || arg.startsWith('https://')) {
        return arg;
      }
    }
    return null;
  }

  // Méthode pour nettoyer l'URL du protocole personnalisé
  private cleanProtocolUrl(url: string): string | null {
    if (url.startsWith('navweb://')) {
      // Extraire l'URL après navweb://
      const cleanUrl = url.replace('navweb://', '');
      
      // Si l'URL ne commence pas par http/https, ajouter https://
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        return `https://${cleanUrl}`;
      }
      return cleanUrl;
    }
    return url;
  }

  private createWindow(url: string = ''): BrowserWindow {
    const window = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 400,
      minHeight: 300,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 15, y: 9 },
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
    // (Supprimé will-navigate car ça ne fonctionne pas avec window.location.href)

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
    const browserWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 400,
      minHeight: 300,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 15, y: 12 },
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

  public convertToBrowserWindow(window: BrowserWindow, url: string): void {
    // Charger la page du navigateur avec WebView
    window.loadFile(join(__dirname, '../src/renderer/index.html'));
    
    // Une fois chargée, naviguer vers l'URL
    window.webContents.once('dom-ready', () => {
      window.webContents.send('navigate-to', url);
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

// Démarrer l'application
new MinimalBrowser();
