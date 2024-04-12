import { BrowserWindow, Menu, Tray, app, dialog, ipcMain } from "electron";
import path from "path";
import { UiohookKey, uIOhook } from "uiohook-napi";
import { fileURLToPath } from "url";

const isPackaged = app.isPackaged;
const __dirname: string = path.dirname(fileURLToPath(import.meta.url));

uIOhook.on("keydown", (e) => {
    if (e.keycode === UiohookKey.Q) {
        console.log("Hello!");
    }

    if (e.keycode === UiohookKey.Escape) {
        process.exit(0);
    }
});

uIOhook.start();

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "./preload.mjs"),
            sandbox: false,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    ipcMain.on("set-title", (event, title) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win?.setTitle(title);
    });

    ipcMain.handle("dialog:openFile", async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow);
        if (!canceled) {
            return filePaths[0];
        }
    });

    ipcMain.on("counter-value", (_event, value) => {
        console.log(value);
    });

    // 菜单
    const menu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {
                    click: () =>
                        mainWindow.webContents.send("update-counter", 1),
                    label: "增加",
                },
                {
                    click: () =>
                        mainWindow.webContents.send("update-counter", -1),
                    label: "减少",
                },
            ],
        },
    ]);
    Menu.setApplicationMenu(menu);

    // 托盘图标
    const appIcon = new Tray(
        path.join(__dirname, "../src-electron/assets/application.ico")
    );
    const contextMenu = Menu.buildFromTemplate([
        { label: "Item1", type: "radio" },
        { label: "Item2", type: "radio" },
    ]);
    contextMenu.items[1].checked = false;
    appIcon.setContextMenu(contextMenu);

    // 加载 index.html
    if (isPackaged) {
        mainWindow.loadFile("./dist/index.html");
    } else {
        mainWindow.loadURL("http://localhost:5173/");
    }

    // 打开开发工具
    mainWindow.webContents.openDevTools();
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口
        // 点击托盘图标时通常会重新创建一个新窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。
