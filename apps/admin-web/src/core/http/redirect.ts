import { NextResponse } from 'next/server';

export function redirectTo(path: string) {
  return NextResponse.redirect(new URL(path, process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'));
}
