import { NextRequest, NextResponse } from 'next/server'
import { errorHandler } from '../../../lib/middleware'
import dbConnect from '../../../lib/db-connect'
import { StatusCodes } from 'http-status-codes'
import { getUserId } from '../../../lib/jwt'
import { Game } from '../../../models'

async function endpoint(req: NextRequest) {
    const userId = getUserId(req)

    await dbConnect()

    const games = await Game.find({ $or: [{ white: userId }, { black: userId }] }).select('-moves')

    return NextResponse.json(games, { status: StatusCodes.OK })
}

export const GET = errorHandler(endpoint)
