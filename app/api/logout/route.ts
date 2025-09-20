import { NextResponse } from 'next/server';

export async function POST() {
  // No actual logout since there's no authentication
  return NextResponse.json({ success: true });
} 