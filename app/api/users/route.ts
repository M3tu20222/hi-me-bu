import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function GET() {
  await dbConnect()
  const users = await User.find({})
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  await dbConnect()
  const userData = await request.json()
  const user = await User.create(userData)
  return NextResponse.json(user)
}

