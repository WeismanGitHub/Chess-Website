import { testApiHandler } from 'next-test-api-route-handler'
import { StatusCodes } from 'http-status-codes'
import * as appHandler from './route'

describe('POST /api/auth/signout', () => {
    it('should return status 200 and delete cookie', async () => {
        await testApiHandler({
            appHandler,
            async test({ fetch }) {
                const res = await fetch({
                    method: 'POST',
                })

                expect(res.status).toBe(StatusCodes.OK)
                expect(res.headers.getSetCookie().length).toBe(1)
            },
        })
    })
})
