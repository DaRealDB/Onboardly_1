import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = await createServerClient()
  const { token } = await params

  // Get client by portal token (public access)
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select(`
      *,
      tenants (
        id,
        name,
        logo_url,
        brand_color
      ),
      client_tasks (*)
    `)
    .eq('portal_token', token)
    .single()

  if (clientError || !client) {
    return NextResponse.json({ error: 'Portal not found' }, { status: 404 })
  }

  // Update last accessed
  await supabase
    .from('clients')
    .update({ 
      started_at: client.started_at || new Date().toISOString(),
      status: client.status === 'invited' ? 'in_progress' : client.status
    })
    .eq('id', client.id)

  return NextResponse.json({
    client: {
      id: client.id,
      name: client.name,
      email: client.email,
      company_name: client.company_name,
      status: client.status,
      completion_percentage: client.completion_percentage,
      logic_mode: client.logic_mode,
    },
    tenant: client.tenants,
    tasks: client.client_tasks.sort((a: any, b: any) => a.step_order - b.step_order),
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = await createServerClient()
  const { token } = await params
  const body = await request.json()
  const { task_id, status, response_data } = body

  // Verify portal token
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, logic_mode')
    .eq('portal_token', token)
    .single()

  if (clientError || !client) {
    return NextResponse.json({ error: 'Portal not found' }, { status: 404 })
  }

  // Update task
  const updateData: Record<string, any> = { status }
  if (response_data) {
    updateData.response_data = response_data
  }
  if (status === 'complete') {
    updateData.completed_at = new Date().toISOString()
  }

  const { error: taskError } = await supabase
    .from('client_tasks')
    .update(updateData)
    .eq('id', task_id)
    .eq('client_id', client.id)

  if (taskError) {
    return NextResponse.json({ error: taskError.message }, { status: 500 })
  }

  // If strict mode, unlock next task
  if (client.logic_mode === 'strict' && status === 'complete') {
    const { data: tasks } = await supabase
      .from('client_tasks')
      .select('id, status, step_order')
      .eq('client_id', client.id)
      .order('step_order')

    if (tasks) {
      const currentTaskIndex = tasks.findIndex((t: any) => t.id === task_id)
      const nextTask = tasks[currentTaskIndex + 1]
      if (nextTask && nextTask.status === 'locked') {
        await supabase
          .from('client_tasks')
          .update({ status: 'pending' })
          .eq('id', nextTask.id)
      }
    }
  }

  // Recalculate completion percentage
  const { data: allTasks } = await supabase
    .from('client_tasks')
    .select('status')
    .eq('client_id', client.id)

  if (allTasks) {
    const completed = allTasks.filter(
      (t: any) => t.status === 'complete' || t.status === 'verified'
    ).length
    const percentage = Math.round((completed / allTasks.length) * 100)

    const newStatus = percentage === 100 ? 'awaiting_review' : 'in_progress'
    
    await supabase
      .from('clients')
      .update({ 
        completion_percentage: percentage,
        status: newStatus,
        completed_at: percentage === 100 ? new Date().toISOString() : null
      })
      .eq('id', client.id)
  }

  return NextResponse.json({ success: true })
}
