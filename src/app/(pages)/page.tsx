'use client'

import toaster from '../components/toasts'
import { useEffect } from 'react'

export default function () {
    useEffect(() => {
        toaster.success('hello world')
    }, [])

    return <div>home</div>
}
