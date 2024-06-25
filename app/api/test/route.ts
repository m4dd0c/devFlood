import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    return NextResponse.json({
      success: true,
      message: "Hi, Server is working...",
    });
  } catch (error) {
    console.error("ERR:", error);
  }
}
