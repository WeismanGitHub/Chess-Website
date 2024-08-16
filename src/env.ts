import { loadEnvConfig } from '@next/env'
import zod from 'zod'

loadEnvConfig(process.cwd())

const envSchema = zod.object({
    MONGODB_URI: zod.string(),
})

const env = envSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
})

export default env
