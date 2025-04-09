// https://env.t3.gg/docs/nextjs#create-your-schema
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const serverEnv = createEnv({
  server: {
    XAI_API_KEY: z.string().min(1),
    TAVILY_API_KEY: z.string().min(1),
    COHERE_API_KEY: z.string().min(1), 
    E2B_API_KEY: z.string().min(1),
    ELEVENLABS_API_KEY: z.string().min(1),
    EXA_API_KEY: z.string().min(1),
    FIRECRAWL_API_KEY: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
    MEM0_API_KEY: z.string().min(1),
    MEM0_ORG_ID: z.string().min(1),
    MEM0_PROJECT_ID: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
})
