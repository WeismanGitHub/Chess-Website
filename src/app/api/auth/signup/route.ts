import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function POST(req: NextApiRequest) {
    return NextResponse.json({ message: 'hello world' })
}
