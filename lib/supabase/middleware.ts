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

  const protectedPaths = ['/tenantdashboard', '/onboarding', '/api/clients', '/api/workflows', '/api/team']
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )

  const isAdminPath = pathname.startsWith('/admin')
  const authPaths = ['/auth/login', '/auth/signup']
  const isAuthPath = authPaths.some(path => pathname === path)

  if ((isProtectedPath || isAdminPath) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: superAdmin } = await supabase
      .from('super_admins')
      .select('id')
      .eq('id', user.id)
      .single()

    const isSuperAdmin = !!superAdmin

    if (isSuperAdmin) {
      if (isAuthPath || pathname.startsWith('/tenantdashboard') || pathname.startsWith('/onboarding')) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
      return supabaseResponse 
    }

    if (!isSuperAdmin) {
      if (isAdminPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/tenantdashboard'
        return NextResponse.redirect(url)
      }

      const { data: memberships, error } = await supabase
        .from('team_members')
        .select('company_id') 
        .eq('user_id', user.id)
        .limit(1)

      const hasWorkspace = !error && memberships && memberships.length > 0

      if (isAuthPath) {
        const url = request.nextUrl.clone()
        url.pathname = hasWorkspace ? '/tenantdashboard' : '/onboarding'
        return NextResponse.redirect(url)
      }

      if (pathname === '/onboarding' && hasWorkspace) {
        const url = request.nextUrl.clone()
        url.pathname = '/tenantdashboard'
        return NextResponse.redirect(url)
      }

      const referer = request.headers.get('referer')
      const isFromOnboarding = referer?.includes('/onboarding')
      
      if (pathname.startsWith('/tenantdashboard') && !hasWorkspace && !isFromOnboarding) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}