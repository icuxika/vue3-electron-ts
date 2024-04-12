export const useNative = () => {
    const setTitle = (title: string) => {
        window.electronAPI.setTitle(title);
    };

    const openFile = (): Promise<string> => window.electronAPI.openFile();

    const onUpdateCounter = (callback: (value: number) => void) => {
        return window.electronAPI.onUpdateCounter(callback);
    };

    const counterValue = (value: number) => {
        window.electronAPI.counterValue(value);
    };

    return { setTitle, openFile, onUpdateCounter, counterValue };
};
