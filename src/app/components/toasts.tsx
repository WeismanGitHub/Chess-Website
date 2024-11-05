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
                    <Toast
                        style={{ zIndex: 50 }}
                        className={`toast p absolute right-0 top-0 mt-5 break-all sm:me-5 ${classes}`}
                    >
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
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"></path>
            </svg>
        </div>
    </div>,
    'failure-toast-flash'
)
