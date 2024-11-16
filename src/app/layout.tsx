import { ToastContainer } from 'react-toastify'
import Navbar from './components/navbar'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import React from 'react'

import 'react-toastify/dist/ReactToastify.css'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Chess',
    description: '',
    keywords: ['chess', 'free', 'website', 'open source', 'foss'],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="min-h-full">
            <body className="min-h-full bg-white">
                <div className="relative flex min-h-screen flex-col">
                    <header>
                        <Navbar />
                    </header>
                    {/* Background Gradient */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 z-[-2] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.4),rgba(255,255,255,0))]"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 z-[-3] rotate-180 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.4),rgba(255,255,255,0))]"
                    />
                    <main className={`${inter.className} flex flex-1 items-center justify-center`}>
                        {children}
                        <ToastContainer />
                    </main>
                </div>
            </body>
        </html>
    )
}
