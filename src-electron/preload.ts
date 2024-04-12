import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    setTitle: (title: string) => ipcRenderer.send("set-title", title),
    openFile: (): Promise<string> => ipcRenderer.invoke("dialog:openFile"),
    onUpdateCounter: (callback: (value: number) => void) =>
        ipcRenderer.on("update-counter", (_event, value) => callback(value)),
    counterValue: (value: number) => ipcRenderer.send("counter-value", value),
});
