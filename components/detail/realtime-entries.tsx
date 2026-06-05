'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RightPanel } from './right-panel'
import type { Entry } from '@/types'

export function RealtimeEntries({
  projectId,
  initialEntries,
}: {
  projectId: string
  initialEntries: Entry[]
}) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`entries:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'entries',
          filter: `project_id=eq.${projectId}`,
        },
        payload => {
          setEntries(prev => [...prev, payload.new as Entry])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  return <RightPanel projectId={projectId} entries={entries} />
}
