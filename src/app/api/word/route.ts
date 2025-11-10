import { NextResponse } from "next/server";
import { words } from "@/data/words";
 
export async function GET() {
  // const randomIndex = Math.floor(Math.random() * words.length);
  // const word = words[randomIndex];
  // fetch localhost:8000
  const response = await fetch('http://localhost:8000/api/word');
  console.log(response)
  const data = await response.json();
  console.log("Tae was here...")
  return NextResponse.json({ data });
}