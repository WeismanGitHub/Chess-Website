import { NextRequest, NextResponse } from 'next/server'
import { StatusCodes } from 'http-status-codes'

function handler(_req: NextRequest) {
    return NextResponse.json({ message: 'This endpoint does not exist.' }, { status: StatusCodes.NOT_FOUND })
}

export { handler as GET, handler as POST, handler as DELETE, handler as PATCH, handler as PUT }
