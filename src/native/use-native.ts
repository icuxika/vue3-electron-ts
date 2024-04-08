export const useNative = () => {
    const setTitle = (title: string) => {
        window.electronAPI.setTitle(title);
    };
    return { setTitle };
};
