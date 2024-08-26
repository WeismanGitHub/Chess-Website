import { NextResponse, NextRequest } from 'next/server'
import { ApiError } from 'next/dist/server/api-utils'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

export function errorHandler(...handlers: ((...args: any) => Promise<NextResponse<unknown>>)[]) {
    return async (req: NextRequest, res: NextResponse) => {
        try {
            for (const handler of handlers) {
                return await handler(req, res)
            }
        } catch (error) {
            if (error instanceof ApiError) {
                return NextResponse.json({ message: error.message }, { status: error.statusCode })
            }

            if (error instanceof ZodError) {
                let message = ''

                for (const err of error.errors) {
                    message += err.message + '. '
                }

                return NextResponse.json({ message: message.trimEnd() }, { status: StatusCodes.BAD_REQUEST })
            }

            console.log(error)

            return NextResponse.json(
                { message: 'Something went wrong.' },
                { status: StatusCodes.INTERNAL_SERVER_ERROR }
            )
        }
    }
}
