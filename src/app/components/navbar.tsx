'use client'

import { Button, Modal, Navbar } from 'flowbite-react'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '../actions/auth'
import { FailureToast } from './toasts'
import { useState } from 'react'
import Link from 'next/link'

export default function () {
    const path = usePathname()
    const router = useRouter()

    const [message, setMessage] = useState<string | null>(null)
    const [openModal, setOpenModal] = useState(false)

    const authenticated = Boolean(localStorage.getItem('authenticated'))

    return (
        <>
            <FailureToast
                message={message ?? ''}
                show={message !== null}
                handleDismiss={() => setMessage(null)}
            />
            <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                        <h3 className="mb-5 text-lg font-normal">
                            <strong></strong>
                            Are you sure you want to log out?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={async () => {
                                    setMessage(null)

                                    const res = await logout()

                                    if (res.success) {
                                        localStorage.removeItem('authenticated')
                                        setOpenModal(false)
                                        return router.push('/auth/login')
                                    }

                                    setMessage(res.message)
                                }}
                            >
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Navbar fluid rounded className="navbar-border bg-transparent">
                <Navbar.Brand as={Link} href="/">
                    <img src="/icon.svg" className="h-6 sm:h-9" alt="pawn logo" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold">Chess</span>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Navbar.Link className="nav-link" as={Link} href="/" active={path == '/'}>
                        Home
                    </Navbar.Link>
                    <Navbar.Link
                        className="nav-link"
                        as={Link}
                        href="/games"
                        active={path.startsWith('/games')}
                    >
                        Games
                    </Navbar.Link>
                    <Navbar.Link className="nav-link" as={Link} href="/about" active={path == '/about'}>
                        About
                    </Navbar.Link>
                    {authenticated ? (
                        <Navbar.Link className="nav-link cursor-pointer" onClick={() => setOpenModal(true)}>
                            Logout
                        </Navbar.Link>
                    ) : (
                        <Navbar.Link
                            className="nav-link"
                            as={Link}
                            href="/auth/register"
                            active={path == '/auth/register'}
                        >
                            Register
                        </Navbar.Link>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}
