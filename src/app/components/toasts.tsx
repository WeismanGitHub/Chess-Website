import { Id, toast, ToastOptions } from 'react-toastify'
import { Toast } from 'flowbite-react'
import React from 'react'

type ToastProps = { title?: string; text: string }

function CustomToast({ title, text }: ToastProps) {
    return (
        // I need the Toast element so I can get the toggle
        <Toast className="m-0 h-full w-full border-0 p-0 text-gray-500 shadow-none">
            <div className="flex flex-col">
                <p className="text-xl">{title}</p>
                <p>{text}</p>
            </div>
            <Toast.Toggle className="bg-transparent" onDismiss={() => {}} />
        </Toast>
    )
}

const options: ToastOptions = {
    draggablePercent: 60,
    autoClose: false,
    draggable: true,
    closeButton: <></>,
    closeOnClick: true,
}

const toaster = (props: ToastProps): Id => toast(<CustomToast {...props} />, options)

toaster.success = ({ text, title = 'Success' }: ToastProps): Id =>
    toast.success(<CustomToast text={text} title={title} />, options)

toaster.error = ({ text, title = 'Error' }: ToastProps): Id =>
    toast.error(<CustomToast text={text} title={title} />, options)

export default toaster
