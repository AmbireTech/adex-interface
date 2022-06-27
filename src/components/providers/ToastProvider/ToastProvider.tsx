import { createContext, useState, FC, PropsWithChildren, useEffect, useCallback, ReactNode, createRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Close } from 'grommet-icons'

type ToastOptions = {
    timeout: number,
    error: boolean,
    position: string,
    sticky: boolean,
    badge?: ReactNode,
    onClick?: () => {},
    url?: string,
    route?: string,
}

interface IToastProvider {
    addToast: (content: ReactNode, options?: ToastOptions) => number,
    removeToast: (id: number) => void
}

interface Toast extends ToastOptions {
    id: number,
    content: ReactNode,
    ref: any
}

const defaultOptions: ToastOptions = {
    timeout: 80000,
    error: false,
    position: 'center',
    sticky: false,
    badge: null,
}

const ToastContext = createContext<IToastProvider>({
    addToast: (c: ReactNode | string, o?: ToastOptions) => 0,
    removeToast: (a) => { console.log({ a }) },
})

const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const [id, setId] = useState<number>(0)
    const [toasts, setToasts] = useState<Array<Toast>>([])

    const removeToast = useCallback((id: number) => {
        setToasts(toasts => toasts.filter(t => t.id !== id))
    }, []);

    const addToast = useCallback((content: ReactNode, options?: ToastOptions) => {
        const nextId = id + 1
        setId(nextId)
        console.log(nextId)
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

    const updateToastsPositions = useCallback(() => {
        toasts
            .filter(({ sticky }) => !sticky)
            .forEach(({ id, ref }) => {
                const toastElement = ref.current
                if (!toastElement) return

                let bottomToasts = []
                for (let i = id; i <= toasts[toasts.length - 1].id; i++) {
                    const element = toasts.filter(({ sticky }) => !sticky).find(({ id }) => id === i)
                    if (element) bottomToasts.push(element)
                }

                const style = getComputedStyle(toastElement)
                const marginBottom = parseInt(style.marginBottom)

                const x = (document.body.clientWidth / 2) - (toastElement.clientWidth / 2)
                const y = bottomToasts.map(({ ref }) => ref.current && ref.current.offsetHeight).reduce((acc, curr) => acc + curr + marginBottom, 0)
                toastElement.style.transform = `translate(${x}px, -${y}px)`
            })
    }, [toasts])

    useEffect(() => updateToastsPositions(), [toasts, updateToastsPositions])
    useEffect(() => {
        const onResize = () => updateToastsPositions()
        window.addEventListener('resize', onResize, false);
        return () => window.removeEventListener('resize', onResize, false);
    }, [updateToastsPositions])

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
            <div id='toast-container' className={!toasts.length ? 'hide' : ''}>
                <TransitionGroup className='transition-group'>
                    {
                        toasts.map(({ id, ref, url, route, error, sticky, badge, position, content, onClick }) => (
                            <CSSTransition timeout={200} classNames='slide-fade' key={id} nodeRef={ref}>
                                <div className={`toast ${error ? 'error' : ''} ${sticky ? 'sticky' : ''} ${position ? position : ''}`} ref={ref}>
                                    <div className='inner' onClick={() => onToastClick(id, onClick, url, route)}>
                                        {badge ? <div className='badge'>{badge}</div> : null}
                                        {content}
                                    </div>
                                    {
                                        sticky ?
                                            <div className='close' onClick={() => removeToast(id)}>
                                                <Close />
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup>
            </div>
            {children}
        </ToastContext.Provider>
    );
};

export { ToastContext };
export default ToastProvider;