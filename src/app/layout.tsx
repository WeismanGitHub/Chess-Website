import Navbar from './components/navbar'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import React from 'react'
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
        <html lang="en">
            <body>
                {/* https://github.com/ibelick/background-snippets */}
                <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.25),rgba(255,255,255,0))]" />
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className={`${inter.className} flex flex-1 items-center justify-center`}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
