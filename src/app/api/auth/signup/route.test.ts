import { POST } from './route'

it('should return data with status 200', async () => {
    const response = await POST()
    const body = await response.json()

    expect(body.message).toBe('hello world')
})
