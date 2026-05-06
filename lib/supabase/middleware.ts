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

  const isAdminPath = pathname.startsWith('/admin')
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPath = authPaths.some(path => pathname === path)

  // 1. If not authenticated and trying to access protected route -> kick to login
  if ((isProtectedPath || isAdminPath) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // 2. If authenticated, determine role and route accordingly
  if (user) {
    // Check if user is a Super Admin FIRST
    const { data: superAdmin } = await supabase
      .from('super_admins')
      .select('id')
      .eq('id', user.id)
      .single()

    const isSuperAdmin = !!superAdmin

    // --- SUPER ADMIN LOGIC ---
    if (isSuperAdmin) {
      // If Super Admin tries to visit login, signup, dashboard, or onboarding -> force them to Admin panel
      if (isAuthPath || pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
      return supabaseResponse // Let them proceed to /admin normally
    }

    // --- STANDARD TENANT LOGIC ---
    // --- STANDARD TENANT LOGIC ---
    if (!isSuperAdmin) {
      // Prevent standard users from accessing Admin routes
      if (isAdminPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }

      // Check if tenant has a workspace
      // FIXED: Changed 'tenant_id' to 'company_id' to match your schema
      const { data: memberships, error } = await supabase
        .from('team_members')
        .select('company_id') 
        .eq('user_id', user.id)
        .limit(1)

      const hasWorkspace = !error && memberships && memberships.length > 0

      // If hitting login/signup pages, push them to their proper home
      if (isAuthPath) {
        const url = request.nextUrl.clone()
        url.pathname = hasWorkspace ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(url)
      }

      // If they have a workspace but try to go to onboarding -> force to dashboard
      if (pathname === '/onboarding' && hasWorkspace) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }

      // If they hit dashboard but have no workspace -> force to onboarding
      const referer = request.headers.get('referer')
      const isFromOnboarding = referer?.includes('/onboarding')
      
      if (pathname.startsWith('/dashboard') && !hasWorkspace && !isFromOnboarding) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}