import { type NextRequest, NextResponse, type MiddlewareConfig } from 'next/server'
import { StatusCodes } from 'http-status-codes'

const unprotectedRoutes = ['/api/auth']

export function middleware(request: NextRequest) {
    if (
        !unprotectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) &&
        !request.cookies.get('auth')
    ) {
        return new NextResponse('Please sign in.', { status: StatusCodes.UNAUTHORIZED })
    }
}

export const config: MiddlewareConfig = {
    matcher: '/api/:path*',
}
