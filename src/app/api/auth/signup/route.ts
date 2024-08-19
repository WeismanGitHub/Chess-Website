import { credentialsSchema } from '../../../../lib/zod'
import dbConnect from '../../../../lib/dbConnect'
import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'
import User from '../../../../models/User'

type body = {
    name: string | undefined
    password: string | undefined
}

export async function POST(req: Request) {
    const body: body = await req.json().catch(() => {
        throw new Error('Cannot parse request body.')
    })

    const { name, password } = await credentialsSchema.parseAsync(body)

    await dbConnect()

    const user = await User.create({
        name,
        password,
    })

    console.log(user)

    return NextResponse.json({}, { status: StatusCodes.CREATED })
}
