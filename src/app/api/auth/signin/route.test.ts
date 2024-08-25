import { testApiHandler } from 'next-test-api-route-handler'
import dbConnect from '../../../../lib/dbConnect'
import { StatusCodes } from 'http-status-codes'
import { User } from '../../../../models'
import * as appHandler from './route'
import mongoose from 'mongoose'

const credentials = {
    name: 'test',
    password: 'ValidPassword1',
}

beforeAll(async () => {
    await dbConnect()

    await User.create(credentials)
})

afterAll(async () => {
    await User.deleteMany()
    await mongoose.connection.close()
})

describe('POST /api/auth/signin', () => {
    it('should return status 200 and auth cookie', async () => {
        await testApiHandler({
            appHandler,
            async test({ fetch }) {
                const res = await fetch({
                    method: 'POST',
                    body: JSON.stringify(credentials),
                })

                expect(res.status).toBe(StatusCodes.OK)
                expect(res.cookies.find((cookie) => cookie['auth'])).toBeTruthy()
            },
        })
    })

    // it('should return status 400 for invalid input', async () => {
    //     await testApiHandler({
    //         appHandler,
    //         async test({ fetch }) {
    //             const res = await fetch({
    //                 method: 'POST',
    //                 body: JSON.stringify({}),
    //             })

    //             expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    //         },
    //     })
    // })
})
