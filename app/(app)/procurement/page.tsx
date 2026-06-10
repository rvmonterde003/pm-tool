import { createClient } from '@/lib/supabase/server'
import { ProcurementTable } from '@/components/procurement/procurement-table'

export default async function ProcurementPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('procurement_items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-6 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Procurement</h1>
        <p className="text-sm text-text-muted mt-1">Track parts, materials, and purchase status</p>
      </div>
      <ProcurementTable items={items ?? []} />
    </div>
  )
}
