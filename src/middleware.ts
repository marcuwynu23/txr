
'use server'

import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { decrypt } from './lib/session'

// Routes protected by role
const protectedRoutes = [
  { path: '/admin', roles: ['admin'] },
  { path: '/tickets', roles: ['attendee', 'admin'] }
]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route.path))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const cookieStore = await cookies()
  const cookie = cookieStore.get('session_token')?.value
  const session = await decrypt(cookie)

  // Redirect to login if no session
  if (!session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Check role permissions
  const requiredRoles = protectedRoutes.find(route => path.startsWith(route.path))?.roles || []
  const userRole = session.role as string

  if (!requiredRoles.includes(userRole)) {
      if (userRole === 'admin') return NextResponse.redirect(new URL('/admin', req.nextUrl));
      return NextResponse.redirect(new URL('/tickets', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
