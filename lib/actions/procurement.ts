'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, ProcurementItem, ProcurementRemarks } from '@/types'

export async function createProcurementItem({
  item_name,
  qty,
  specification,
  usage,
  sample_link,
}: {
  item_name: string
  qty: number
  specification: string
  usage: string
  sample_link: string | null
}): Promise<ActionResult<ProcurementItem>> {
  if (!item_name.trim()) return { data: null, error: 'Item name is required.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { data, error } = await supabase
    .from('procurement_items')
    .insert({
      item_name: item_name.trim(),
      qty: Math.max(1, qty),
      specification: specification.trim(),
      usage: usage.trim(),
      sample_link: sample_link?.trim() || null,
      remarks: 'waiting',
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/procurement')
  return { data, error: null }
}

export async function updateProcurementItem({
  id,
  item_name,
  qty,
  specification,
  usage,
  sample_link,
  remarks,
}: {
  id: string
  item_name: string
  qty: number
  specification: string
  usage: string
  sample_link: string | null
  remarks: ProcurementRemarks
}): Promise<ActionResult<ProcurementItem>> {
  if (!item_name.trim()) return { data: null, error: 'Item name is required.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { data, error } = await supabase
    .from('procurement_items')
    .update({
      item_name: item_name.trim(),
      qty: Math.max(1, qty),
      specification: specification.trim(),
      usage: usage.trim(),
      sample_link: sample_link?.trim() || null,
      remarks,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/procurement')
  return { data, error: null }
}

export async function updateProcurementRemarks(
  id: string,
  remarks: ProcurementRemarks
): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { error } = await supabase
    .from('procurement_items')
    .update({ remarks })
    .eq('id', id)

  if (error) return { data: null, error: error.message }

  revalidatePath('/procurement')
  return { data: null, error: null }
}

export async function deleteProcurementItem(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { error } = await supabase.from('procurement_items').delete().eq('id', id)
  if (error) return { data: null, error: error.message }

  revalidatePath('/procurement')
  return { data: null, error: null }
}
