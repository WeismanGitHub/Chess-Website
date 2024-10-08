'use server'

import errorHandler from '../error-handler'
import { cookies } from 'next/headers'

export default errorHandler(async () => {
    cookies().delete('auth')
})
