import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    darkTheme: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

  const { getCursorScreenPoint, getDisplayNearestPoint } = screen
  const currentScreen = getDisplayNearestPoint(getCursorScreenPoint())
  const winBounds: Partial<Electron.Rectangle> = {
    height: 560,
    width: 940,
    x: currentScreen.workArea.x + currentScreen.workArea.width / 2 - 940 / 2,
    y: currentScreen.workArea.y + currentScreen.workArea.height / 2 - 560 / 2,
  }
  mainWindow.setBounds(winBounds)

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

ipcMain.on('exit', () => app.quit())

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
