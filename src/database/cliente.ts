import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const client = new Client({
  connectionString: process.env.DATABASE_URL
})

// Conectar ao banco de dados
client.connect().catch((err: Error) => {
  console.error('Erro ao conectar ao banco de dados:', err)
  process.exit(1)
})

export const db = drizzle(client)

