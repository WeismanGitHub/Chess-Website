'use client'

import Link from 'next/link'
import { Navbar } from 'flowbite-react'
import { usePathname } from 'next/navigation'

export default function () {
    const path = usePathname()

    return (
        <Navbar fluid rounded className="border-b-2 border-[#daeaee] bg-transparent">
            <Navbar.Brand as={Link} href="/">
                <img src="/icon.svg" className="mr-3 h-6 sm:h-9" alt="pawn logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold">Chess</span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link href="/" active={path == '/'}>
                    Home
                </Navbar.Link>
                <Navbar.Link href="/auth/register" active={path == '/auth/register'}>
                    Register
                </Navbar.Link>
                <Navbar.Link as={Link} href="/about" active={path == '/about'}>
                    About
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}
