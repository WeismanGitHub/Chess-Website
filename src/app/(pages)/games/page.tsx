'use client'

import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'

export default function () {
    return (
        <>
            <div className="mx-auto flex w-full flex-col items-center justify-center px-6 py-8 lg:py-0">
                <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
                    <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Create a game
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <Label
                                    htmlFor="minutes"
                                    className="mb-2 block text-sm font-medium text-gray-900"
                                >
                                    Minutes
                                </Label>
                                <TextInput
                                    type="number"
                                    name="minutes"
                                    max={120}
                                    defaultValue={30}
                                    min={1}
                                    id="minutes"
                                    required={true}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="text-md w-full rounded-lg px-5 py-2.5 text-center focus:outline-none focus:ring-4"
                            >
                                Create game
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
