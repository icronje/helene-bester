import path from "node:path"
import { defineConfig } from "@prisma/config"
import { config } from "dotenv"

// Load .env.local first (overrides .env), then .env as fallback
config({ path: ".env.local" })
config({ path: ".env" })

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
