import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement real data fetching from Supabase auth users or custom table
  // For now, return empty array
  return NextResponse.json([])
}