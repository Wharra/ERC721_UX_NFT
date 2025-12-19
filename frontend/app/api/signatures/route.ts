import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'claimerV1-tools', 'output-sig.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const signatures = JSON.parse(fileContents)
    return NextResponse.json(signatures)
  } catch (error) {
    console.error('Error reading signatures file:', error)
    return NextResponse.json([], { status: 500 })
  }
}

