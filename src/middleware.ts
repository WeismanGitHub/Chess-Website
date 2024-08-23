import { NextResponse, type MiddlewareConfig, type NextRequest } from 'next/server'
import { StatusCodes } from 'http-status-codes'

export function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith('/api/auth') && !request.cookies.get('auth')) {
        return new NextResponse('Please sign in.', { status: StatusCodes.UNAUTHORIZED })
    }
}

export const config: MiddlewareConfig = {
    matcher: '/api/:path*',
}
