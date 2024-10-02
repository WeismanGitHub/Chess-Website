'use client'

import Link from 'next/link'
import { Navbar } from 'flowbite-react'
import { usePathname } from 'next/navigation'

export default function () {
    const path = usePathname()

    return (
        <Navbar fluid rounded className="navbar-border bg-transparent">
            <Navbar.Brand as={Link} href="/">
                <img src="/icon.svg" className="h-6 sm:h-9" alt="pawn logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold">Chess</span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                {/* make the hitbox larger */}
                <Navbar.Link as={Link} href="/" active={path == '/'}>
                    Home
                </Navbar.Link>
                <Navbar.Link as={Link} href="/games" active={path.startsWith('/games')}>
                    Games
                </Navbar.Link>
                <Navbar.Link as={Link} href="/about" active={path == '/about'}>
                    About
                </Navbar.Link>
                <Navbar.Link as={Link} href="/auth/register" active={path == '/auth/register'}>
                    Register
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}
