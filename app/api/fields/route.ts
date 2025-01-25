import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Field from "@/models/Field"

export async function GET() {
  await dbConnect()
  const fields = await Field.find({})
  return NextResponse.json(fields)
}

export async function POST(request: Request) {
  await dbConnect()
  const fieldData = await request.json()
  const field = await Field.create(fieldData)
  return NextResponse.json(field)
}

