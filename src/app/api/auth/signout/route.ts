import { errorHandler } from '../../../../lib/middleware'
import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function endpoint() {
    cookies().delete('auth')

    return NextResponse.json({}, { status: StatusCodes.OK })
}

export const POST = errorHandler(endpoint)
