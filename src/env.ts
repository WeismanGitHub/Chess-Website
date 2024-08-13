import zod from 'zod'

const envSchema = zod.object({
    MONGODB_URI: zod.string(),
})

export default envSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
})
