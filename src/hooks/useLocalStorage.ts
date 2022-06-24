import useStorage, { HookProps } from "./useStorage"

export default function useLocalStorage<T>({
    key,
    defaultValue,
    isStringStorage,
    setInit
}: Omit<HookProps<T>, 'storage'>): [T, (item: T) => void, () => void] {
    return useStorage<T>({ storage: localStorage, key, defaultValue, isStringStorage, setInit })
}
