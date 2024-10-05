'use server'

import { credentialsSchema } from '../../../lib/zod'
import { Error as MongooseError } from 'mongoose'
import dbConnect from '../../../lib/db-connect'
import { signAuthJwt } from '../../../lib/jwt'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { User } from '../../../models'

export default async function (body: { name: string; password: string }) {
    const { name, password } = await credentialsSchema.parseAsync(body)

    await dbConnect()

    const user = await User.create({
        name,
        password,
    }).catch((error) => {
        if (error instanceof MongooseError.ValidationError) {
            for (const err of Object.values(error.errors)) {
                if (err.kind === 'unique') {
                    throw new Error('Name must be unique.')
                } else {
                    throw new Error('A validation error occurred.')
                }
            }
        }

        throw error
    })

    cookies().set('auth', signAuthJwt(user.id), { httpOnly: true, sameSite: true, secure: true })
    redirect('/')
}
