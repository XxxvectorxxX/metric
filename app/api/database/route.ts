import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'database.json')

// 🔍 GET
export async function GET() {
  try {
    const file = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(file)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch {
    return NextResponse.json({
      success: true,
      data: null,
    })
  }
}

// 💾 POST
export async function POST(req: Request) {
  try {
    const body = await req.json()

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2))

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({
      success: false,
      error: 'Erro ao salvar',
    })
  }
}