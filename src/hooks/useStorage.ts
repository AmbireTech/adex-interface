import { useCallback, useState } from "react"

interface Storage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

export type HookProps<T> = {
    storage: Storage;
    key: string;
    defaultValue: T;
    isStringStorage?: boolean;
    setInit?: (item: any) => any;
}

const setInitDefault = (item: any): any => item

/**
 * The main role of this hook is to hide the Storage provider we are using under the hood (AsyncStorage/localStorage).
 * This will allow us to share code between mobile/web.
 *
 * @param storage - Object implementing Storage interface. For instance, localStorage.
 * @param key - Storage item key name.
 * @param defaultValue - Default value to be used, in the case the Storage item is not set. It is used for value after removeItem.
 * @param isStringStorage - Flag for disabling parsing and item stringifying. If it's enabled, we will treat whatever is in the storage as a string.
 * @param setInit - In some advanced cases, we need to perform additional logic for setting the defaultValue, based on the Storage item parsed value.
 * setInit function will provide us quick access to the parsed Storage item and based on its value we can return the needed default/init value of the hook.
 */
export default function useStorage<T>({
    storage,
    key,
    defaultValue,
    isStringStorage = false,
    setInit = setInitDefault,
}: HookProps<T>): [T, (item: T ) => void, () => void] {
    const [item, set] = useState<T>(() => {
        // In case the item is not set in the storage, we just fall back to `defaultValue`
        if (!storage.getItem(key)) return setInit(defaultValue)

        if (isStringStorage) return setInit(storage.getItem(key))

        // Here we are going to keep the parsed item value.
        // If the parsing failed, we just fall back to `defaultValue`.
        let parsedItem

        try {
            parsedItem = JSON.parse(storage.getItem(key)!)
        } catch (e) {
            console.error(`Storage item parsing failure. Item key: ${key}`, e)

            parsedItem = defaultValue
        }

        return setInit(parsedItem)
    })

    const setItem = useCallback((value: T | undefined): void => {
        set((prevState: any) => {
            const itemValue = typeof value === 'function' ? value(prevState) : value

            if (isStringStorage && typeof itemValue !== 'string') {
                throw new Error(`Wrong item type. We expect a string to be passed, but got ${typeof itemValue}!`)
            }

            storage.setItem(key, isStringStorage ? itemValue : JSON.stringify(itemValue))

            return itemValue
        })
    }, [storage, key, isStringStorage])

    const removeItem = useCallback((): void => {
        storage.removeItem(key)
        set(defaultValue)
    }, [storage, key, defaultValue])

    return [item, setItem, removeItem]
}
