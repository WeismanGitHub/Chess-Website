'use client'

import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'

export default function () {
    return (
        <>
            <div className="mx-auto flex w-full flex-col items-center justify-center px-6 py-8 lg:py-0">
                <a href="/" className="mb-6 flex items-center text-4xl font-semibold">
                    <img className="h-12 w-12" src="/icon.svg" alt="pawn logo" />
                    Chess
                </a>
                <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
                    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Log in
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-900"
                                >
                                    Your email
                                </Label>
                                <TextInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="name@company.com"
                                    required={true}
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-gray-900"
                                >
                                    Password
                                </Label>
                                <TextInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••••"
                                    required={true}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="text-md w-full rounded-lg px-5 py-2.5 text-center focus:outline-none focus:ring-4"
                            >
                                Log in
                            </Button>
                            <p className="text-sm font-light text-gray-500">
                                Don't have an account?{' '}
                                <a href="/auth/register" className="font-medium hover:underline">
                                    Register here
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
