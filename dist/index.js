"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
var createWindow = function () {
    // Create the browser window.
    var mainWindow = new electron_1.BrowserWindow({
        frame: false,
        darkTheme: true,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.once('ready-to-show', function () { return mainWindow.show(); });
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
    var getCursorScreenPoint = electron_1.screen.getCursorScreenPoint, getDisplayNearestPoint = electron_1.screen.getDisplayNearestPoint;
    var currentScreen = getDisplayNearestPoint(getCursorScreenPoint());
    var winBounds = {
        height: 560,
        width: 940,
        x: currentScreen.workArea.x + currentScreen.workArea.width / 2 - 940 / 2,
        y: currentScreen.workArea.y + currentScreen.workArea.height / 2 - 560 / 2
    };
    mainWindow.setBounds(winBounds);
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
electron_1.ipcMain.on('exit', function () { return electron_1.app.quit(); });
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//# sourceMappingURL=index.js.map