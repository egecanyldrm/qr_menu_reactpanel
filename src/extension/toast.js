// ** React Imports
import { toast } from 'react-toastify'

export const ToastSuccess = (message) => {
    return toast.success(message, {
        autoClose: 3000,
        hideProgressBar: true,
        position: 'top-right'
    })
}

export const ToastError = (message) => {
    return toast.error(message, {
        autoClose: 3000,
        hideProgressBar: true,
        position: 'top-right'
    })
}
export const ToastErrorTopCenter = (message) => {
    return toast.error(message, {
        autoClose: 3000,
        hideProgressBar: true,
        position: 'top-center'
    })
}

export const ErrorToast = ({ message }) => {
    return toast.error(message, {
        autoClose: 3000,
        hideProgressBar: true,
        position: 'top-right'
    })
}