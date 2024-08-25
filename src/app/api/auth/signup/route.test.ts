import { testApiHandler } from 'next-test-api-route-handler'
import dbConnect from '../../../../lib/dbConnect'
import { StatusCodes } from 'http-status-codes'
import { User } from '../../../../models'
import * as appHandler from './route'
import mongoose from 'mongoose'

beforeAll(async () => {
    await dbConnect()
})

afterEach(async () => {
    await User.deleteMany()
})

afterAll(async () => {
    await mongoose.connection.close()
})

const validCredentials = {
    name: '1',
    password: 'HelloWorld1',
}

describe('POST /api/auth/signup', () => {
    it('should return status 201 and auth cookie', async () => {
        await testApiHandler({
            appHandler,
            async test({ fetch }) {
                const res = await fetch({
                    method: 'POST',
                    body: JSON.stringify(validCredentials),
                })

                expect(res.status).toBe(StatusCodes.CREATED)
                expect(res.cookies.find((cookie) => cookie['auth'])).toBeTruthy()
            },
        })
    })

    it('should return status 400 for invalid input', async () => {
        await testApiHandler({
            appHandler,
            async test({ fetch }) {
                const res = await fetch({
                    method: 'POST',
                    body: JSON.stringify({}),
                })

                expect(res.status).toBe(StatusCodes.BAD_REQUEST)
            },
        })
    })
})
