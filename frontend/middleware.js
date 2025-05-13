import { NextResponse } from 'next/server';

export const config = {
  matcher: '/', // Adjust to match your desired routes
  runtime: 'experimental-edge',
};

export function middleware() {
  return NextResponse.next();
}
