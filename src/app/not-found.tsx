'use client'

import { Button } from 'flowbite-react'
import Link from 'next/link'
import React from 'react'

export default function () {
    return (
        <div className="flex flex-col items-center gap-4">
            <span className="w-full text-6xl font-bold text-black">404 Not Found</span>
            <Button>
                <Link href="/" className="w-fit">
                    Return to home
                </Link>
            </Button>
        </div>
    )
}
