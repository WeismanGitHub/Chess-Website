'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function authCheck() {
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('authenticated')) {
            router.push('/auth/login')
        }
    }, [])
}
