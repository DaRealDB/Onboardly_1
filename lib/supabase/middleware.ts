import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/signup-success',
    '/auth/error',
    '/auth/callback',
    '/portal',
    '/invite',
    '/api/portal',
  ]

  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/onboarding', '/api/clients', '/api/workflows', '/api/team']
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )

  // Admin routes require super admin check
  const isAdminPath = pathname.startsWith('/admin')

  // If not authenticated and trying to access protected route
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Admin routes require additional super_admin check
  if (isAdminPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isAdminPath && user) {
  const { data: superAdmin } = await supabase
    .from('super_admins')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!superAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
}

  // Redirect logged in users away from auth pages to dashboard
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPath = authPaths.some(path => pathname === path)

  if (isAuthPath && user) {
    // Check if user has any tenants
    const { data: memberships } = await supabase
      .from('team_members')
      .select('tenant_id')
      .eq('user_id', user.id)
      .limit(1)

    const url = request.nextUrl.clone()
    
    if (!memberships || memberships.length === 0) {
      // No tenants, redirect to onboarding
      url.pathname = '/onboarding'
    } else {
      // Has tenants, redirect to dashboard
      url.pathname = '/dashboard'
    }
    
    return NextResponse.redirect(url)
  }

  // Onboarding check - if user has tenants, redirect to dashboard
  if (pathname === '/onboarding' && user) {
    const { data: memberships } = await supabase
      .from('team_members')
      .select('tenant_id')
      .eq('user_id', user.id)
      .limit(1)

    if (memberships && memberships.length > 0) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Dashboard check - if user has no tenants, redirect to onboarding
  // Skip this check if coming from onboarding (to allow the just-created tenant to load)
  const referer = request.headers.get('referer')
  const isFromOnboarding = referer?.includes('/onboarding')
  
  if (pathname.startsWith('/dashboard') && user && !isFromOnboarding) {
    const { data: memberships, error } = await supabase
      .from('team_members')
      .select('tenant_id')
      .eq('user_id', user.id)
      .limit(1)

    // Only redirect if we're sure there are no memberships (not on error)
    if (!error && (!memberships || memberships.length === 0)) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
