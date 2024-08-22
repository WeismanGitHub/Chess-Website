import { loadEnvConfig } from '@next/env'
import zod from 'zod'

loadEnvConfig(process.cwd())

const envSchema = zod.object({
    MONGODB_URI: zod.string(),
    JWT_SECRET: zod.string(),
    JWT_EXPIRATION: zod.string(),
})

const env = envSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
})

export default env
