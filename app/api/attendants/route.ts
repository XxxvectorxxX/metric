import { NextResponse } from 'next/server'
import { Client } from 'pg'

export async function GET() {
  let client: Client | null = null

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const configRes = await fetch(`${baseUrl}/api/database`, {
      cache: 'no-store' 
    })
    const configJson = await configRes.json()

    if (!configJson.success || !configJson.data) {
      return NextResponse.json([], { status: 200 }) // 👈 retorna array vazio
    }

    const config = configJson.data

    if (!config.customQuery) {
      return NextResponse.json([], { status: 200 }) // 👈 array vazio
    }

    client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: false
    })

    await client.connect()

    const result = await client.query(config.customQuery)

    const parsed = result.rows.map((row: any) => ({
      id: row.id ?? row.name, // 👈 evita key undefined
      name: row.name,
      pendentes: Number(row.pendentes) || 0,
      atendendo: Number(row.atendendo) || 0,
      finalizados: Number(row.finalizados) || 0,
      total: Number(row.total) || 0,
      media_avaliacoes: row.media_avaliacoes
        ? Number(row.media_avaliacoes)
        : null
    }))

    return NextResponse.json(parsed) // ✅ ARRAY DIRETO

  } catch (error) {
    console.error('ERRO REAL:', error)

    return NextResponse.json([], { status: 200 }) // 👈 nunca quebra o front
  } finally {
    if (client) {
      await client.end().catch(() => {})
    }
  }
}