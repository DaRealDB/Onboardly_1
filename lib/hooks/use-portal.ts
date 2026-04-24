'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Client, ClientTask, Tenant, TaskStatus } from '@/lib/types/database'

const supabase = createClient()

interface PortalData {
  client: Client
  tenant: Tenant
  tasks: ClientTask[]
}

export function usePortal(token: string) {
  const { data, error, isLoading, mutate } = useSWR<PortalData>(
    token ? `portal-${token}` : null,
    async () => {
      // Fetch client by portal token
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('portal_token', token)
        .single()

      if (clientError || !client) {
        throw new Error('Invalid portal link or client not found')
      }

      // Fetch tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', client.tenant_id)
        .single()

      if (tenantError || !tenant) {
        throw new Error('Tenant not found')
      }

      // Fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('client_tasks')
        .select('*')
        .eq('client_id', client.id)
        .order('step_order', { ascending: true })

      if (tasksError) {
        throw new Error('Failed to load tasks')
      }

      return {
        client,
        tenant,
        tasks: tasks || [],
      }
    }
  )

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const { error } = await supabase
      .from('client_tasks')
      .update({ 
        status,
        completed_at: status === 'complete' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    if (!error) {
      mutate()
    }

    return { error: error?.message || null }
  }

  const submitTaskResponse = async (taskId: string, responseData: Record<string, unknown>) => {
    const { error } = await supabase
      .from('client_tasks')
      .update({ 
        response_data: responseData,
        status: 'complete',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    if (!error) {
      mutate()
    }

    return { error: error?.message || null }
  }

  const uploadDocument = async (taskId: string, file: File) => {
    if (!data?.client || !data?.tenant) {
      return { error: 'Portal data not loaded' }
    }

    const fileName = `${Date.now()}-${file.name}`
    const storagePath = `${data.tenant.id}/${data.client.id}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file)

    if (uploadError) {
      return { error: uploadError.message }
    }

    // Create document record
    const { error: docError } = await supabase
      .from('documents')
      .insert({
        client_id: data.client.id,
        task_id: taskId,
        tenant_id: data.tenant.id,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
      })

    if (docError) {
      return { error: docError.message }
    }

    // Update task status
    await submitTaskResponse(taskId, { 
      uploaded_file: file.name,
      uploaded_at: new Date().toISOString()
    })

    return { error: null }
  }

  const startOnboarding = async () => {
    if (!data?.client) return { error: 'Client not found' }

    const { error } = await supabase
      .from('clients')
      .update({ 
        status: 'in_progress',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', data.client.id)

    if (!error) {
      mutate()
    }

    return { error: error?.message || null }
  }

  return {
    client: data?.client || null,
    tenant: data?.tenant || null,
    tasks: data?.tasks || [],
    isLoading,
    error: error?.message || null,
    updateTaskStatus,
    submitTaskResponse,
    uploadDocument,
    startOnboarding,
    refresh: mutate,
  }
}
