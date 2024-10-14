import { Toast } from 'flowbite-react'
import React from 'react'

function toastWrapper(toast: React.ReactElement, classes: string | null = null) {
    return function ({
        message,
        show,
        handleDismiss,
    }: {
        message: string
        show: boolean
        handleDismiss: () => void
    }) {
        return (
            <>
                {show && (
                    <Toast className={`toast absolute right-0 top-0 m-4 ${classes}`}>
                        {toast}
                        <div className="ml-3 text-sm font-normal">{message}</div>
                        <Toast.Toggle className="bg-transparent" onDismiss={handleDismiss} />
                    </Toast>
                )}
            </>
        )
    }
}

export const SuccessToast = toastWrapper(
    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="h-5 w-5"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            ></path>
        </svg>
    </div>,
    'success-toast-flash'
)

export const FailureToast = toastWrapper(
    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
            <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="h-5 w-5"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </div>
    </div>,
    'failure-toast-flash'
)
