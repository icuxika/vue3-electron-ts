import type { IpcRenderer } from "electron";

export interface IElectronAPI {
    setTitle: (title: string) => void;
    openFile: () => Promise<string>;
    onUpdateCounter: (callback: (value: number) => void) => IpcRenderer;
    counterValue: (value: number) => void;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
