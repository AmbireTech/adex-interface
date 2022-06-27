import { useContext } from 'react'
import { ToastContext } from 'components/providers/ToastProvider/ToastProvider'

const useToasts = () => useContext(ToastContext)
export default useToasts