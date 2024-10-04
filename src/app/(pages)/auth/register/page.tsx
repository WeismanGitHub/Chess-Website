'use client'

import { Button, Label, TextInput } from 'flowbite-react'
import { credentialsSchema } from '../../../../lib/zod'
import { Formik, Form } from 'formik'
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
                            Create an account
                        </h1>
                        <Formik
                            initialValues={{
                                name: '',
                                password: '',
                                confirmPassword: '',
                            }}
                            validate={(values) => {
                                const errors: {
                                    name?: string
                                    password?: string
                                    confirmPassword?: string
                                } = {}

                                const res = credentialsSchema.safeParse(values)

                                if (!res.success) {
                                    const fieldErrors = res.error.flatten().fieldErrors
                                    errors.name = fieldErrors.name?.[0]
                                    errors.password = fieldErrors.password?.[0]
                                    errors.confirmPassword = fieldErrors.password?.[0]
                                }

                                if (values.confirmPassword !== values.password) {
                                    errors.confirmPassword = 'Passwords must match'
                                }

                                return errors
                            }}
                            onSubmit={(values) => {
                                console.log(values)
                                throw new Error('Function not implemented.')
                            }}
                            validateOnChange={true}
                            validateOnBlur={true}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                values,
                                errors,
                                touched,
                                setTouched,
                            }) => {
                                return (
                                    <Form
                                        className="mb-4 space-y-4 md:space-y-6"
                                        noValidate
                                        onSubmit={handleSubmit}
                                    >
                                        <div>
                                            <Label
                                                htmlFor="name"
                                                className="mb-2 block text-sm font-medium text-gray-900"
                                            >
                                                Your name
                                            </Label>
                                            <TextInput
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={values.name}
                                                placeholder="username"
                                                required={true}
                                                onBlur={handleBlur}
                                                onChange={(target) => {
                                                    setTouched({
                                                        name: true,
                                                        ...touched,
                                                    })
                                                    handleChange(target)
                                                }}
                                                helperText={
                                                    touched.name && errors.name ? (
                                                        <span>{errors.name}</span>
                                                    ) : undefined
                                                }
                                                color={touched.name && errors.name ? 'failure' : undefined}
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
                                                value={values.password}
                                                onChange={(target) => {
                                                    setTouched({
                                                        password: true,
                                                        ...touched,
                                                    })
                                                    handleChange(target)
                                                }}
                                                autoComplete="on"
                                                type="password"
                                                onBlur={handleBlur}
                                                name="password"
                                                id="password"
                                                placeholder="••••••••••"
                                                required={true}
                                                helperText={
                                                    touched.password && errors.password ? (
                                                        <span>{errors.password}</span>
                                                    ) : undefined
                                                }
                                                color={
                                                    touched.password && errors.password
                                                        ? 'failure'
                                                        : undefined
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="confirmPassword"
                                                className="mb-2 block text-sm font-medium text-gray-900"
                                            >
                                                Confirm password
                                            </Label>
                                            <TextInput
                                                type="password"
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                placeholder="••••••••••"
                                                required={true}
                                                value={values.confirmPassword}
                                                onChange={(target) => {
                                                    setTouched({
                                                        confirmPassword: true,
                                                        ...touched,
                                                    })
                                                    handleChange(target)
                                                }}
                                                onBlur={handleBlur}
                                                autoComplete="on"
                                                helperText={
                                                    touched.confirmPassword && errors.confirmPassword ? (
                                                        <span>{errors.confirmPassword}</span>
                                                    ) : undefined
                                                }
                                                color={
                                                    touched.confirmPassword && errors.confirmPassword
                                                        ? 'failure'
                                                        : undefined
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="text-md w-full rounded-lg px-5 py-2.5 text-center focus:outline-none focus:ring-4"
                                        >
                                            Create an account
                                        </Button>
                                        <p className="text-sm font-light text-gray-500">
                                            Already have an account?{' '}
                                            <a href="/auth/login" className="font-medium hover:underline">
                                                Login here
                                            </a>
                                        </p>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}
