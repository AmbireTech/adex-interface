import { createContext, useState, FC, PropsWithChildren, useEffect, useCallback, ReactNode, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Close } from 'grommet-icons'
import { Layer, Box, Button } from 'grommet'
import { ToastOptions, ToastPositionType, IToastProvider, Toast } from './types'




const defaultOptions: ToastOptions = {
    timeout: 8000,
    error: false,
    position: 'bottom',
    sticky: false,
    badge: null,
    status: 'unknown'
}

const ToastContext = createContext<IToastProvider>({
    addToast: (c: ReactNode | string, o?: ToastOptions) => 0,
    removeToast: (a) => { console.log({ a }) },
})

const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const [id, setId] = useState<number>(0)
    const [toasts, setToasts] = useState<Array<Toast>>([])
    const [layers, setLayers] = useState<{ [key: string]: Array<Toast> }>()

    const removeToast = useCallback((id: number) => {
        console.log({ id })
        setToasts(toasts => toasts.filter(t => t.id !== id))
    }, []);

    const addToast = useCallback((content: ReactNode, options?: ToastOptions) => {
        const nextId = id + 1
        setId(nextId)
        console.log({ nextId })
        const toast = {
            id: nextId,
            content,
            ref: createRef(),
            ...defaultOptions,
            ...options
        }

        setToasts(toasts => [
            ...toasts,
            toast
        ]);

        !toast.sticky && setTimeout(() => removeToast(toast.id), toast.timeout)

        return toast.id;
    }, [setToasts, removeToast, id]);

    useEffect(() => {
        const byLayers = toasts.reduce<{ [key: string]: Array<Toast> }>((l, t) => {
            if (t.position) {
                l[t.position] = [...(l[t.position] || []), t]
            }

            return l
        }, {} as { [key: string]: Array<Toast> })

        setLayers(byLayers)

    }, [toasts])
    const onToastClick = (id: number, onClick?: () => {}, url?: string, route?: string) => {
        if (url) window.open(url, '_blank')
        else if (route) navigate(route)
        onClick ? onClick() : removeToast(id)
    }

    return (
        <ToastContext.Provider
            value={{
                addToast,
                removeToast
            }}
        >
            {!!layers && Object.entries(layers).map(([position, layerToasts]) => (
                <Layer
                    key={position}
                    position={position as ToastPositionType || 'top'}
                    modal={false}>
                    <Box overflow={{ vertical: 'auto', horizontal: 'visible' }}>
                        {
                            layerToasts.map(({ id, ref, url, route, error, status, sticky, badge, position, content, onClick }) => (

                                <Box key={id} margin='xxsmall'
                                    pad='small'
                                    background={`status-${status}`}
                                >
                                    <Box
                                        direction='row'
                                        gap='small'
                                        justify='start'
                                    >
                                        <Box onClick={() => onToastClick(id, onClick, url, route)}>
                                            {content}
                                        </Box>
                                        {sticky &&

                                            <Button plain icon={<Close />}
                                                onClick={() => removeToast(id)}
                                            />
                                        }
                                    </Box>
                                </Box>

                            ))
                        }
                    </Box>

                </Layer>
            ))}


            {children}
        </ToastContext.Provider>
    )
}

export { ToastContext, ToastProvider }