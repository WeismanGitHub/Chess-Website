import { NextResponse, NextRequest } from 'next/server'
import { ApiError } from 'next/dist/server/api-utils'
import { StatusCodes } from 'http-status-codes'

export function errorHandler(...handlers: Function[]) {
    return async (req: NextRequest, res: NextResponse) => {
        try {
            for (const handler of handlers) {
                await handler(req, res)
            }
        } catch (error) {
            if (error instanceof ApiError) {
                return NextResponse.json({ message: error.message }, { status: error.statusCode })
            }

            console.log(error)

            return NextResponse.json(
                { message: 'Something went wrong!' },
                { status: StatusCodes.INTERNAL_SERVER_ERROR }
            )
        }
    }
}
