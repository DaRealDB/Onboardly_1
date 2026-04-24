import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenantId = request.nextUrl.searchParams.get('tenant_id')
  if (!tenantId) {
    return NextResponse.json({ error: 'tenant_id required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('clients')
    .select('*, client_tasks(count)')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { tenant_id, name, email, company_name, phone, workflow_template_id } = body

  if (!tenant_id || !name || !email) {
    return NextResponse.json(
      { error: 'tenant_id, name, and email are required' },
      { status: 400 }
    )
  }

  // Get the workflow template to determine logic mode
  let logicMode = 'strict'
  if (workflow_template_id) {
    const { data: template } = await supabase
      .from('workflow_templates')
      .select('logic_mode')
      .eq('id', workflow_template_id)
      .single()
    if (template) {
      logicMode = template.logic_mode
    }
  }

  // Create client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      tenant_id,
      name,
      email,
      company_name: company_name || null,
      phone: phone || null,
      logic_mode: logicMode,
      status: 'invited',
      portal_token: crypto.randomUUID(),
      invited_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (clientError) {
    return NextResponse.json({ error: clientError.message }, { status: 500 })
  }

  // If workflow template specified, create tasks from template steps
  if (workflow_template_id) {
    const { data: steps } = await supabase
      .from('template_steps')
      .select('*')
      .eq('template_id', workflow_template_id)
      .order('step_order')

    if (steps && steps.length > 0) {
      const tasks = steps.map((step, index) => ({
        client_id: client.id,
        name: step.name,
        description: step.description,
        step_type: step.step_type,
        step_order: step.step_order,
        is_required: step.is_required,
        config: step.config,
        status: logicMode === 'parallel' || index === 0 ? 'pending' : 'locked',
      }))

      await supabase.from('client_tasks').insert(tasks)
    }
  }

  return NextResponse.json(client, { status: 201 })
}
