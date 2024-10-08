'use server'

import { cookies } from 'next/headers'

export default async function () {
    cookies().delete('auth')
}
