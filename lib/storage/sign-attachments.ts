import type { SupabaseClient } from '@supabase/supabase-js'
import type { Entry, EntryAttachment } from '@/types'

async function signAttachment(
  supabase: SupabaseClient,
  attachment: EntryAttachment
): Promise<EntryAttachment> {
  const { data } = await supabase.storage
    .from('attachments')
    .createSignedUrl(attachment.file_url, 3600, { download: attachment.file_name })

  return { ...attachment, signedUrl: data?.signedUrl ?? null }
}

export async function signEntryAttachments(
  supabase: SupabaseClient,
  entries: Entry[]
): Promise<Entry[]> {
  return Promise.all(
    entries.map(async entry => {
      if (!entry.entry_attachments?.length) return entry

      const entry_attachments = await Promise.all(
        entry.entry_attachments.map(att => signAttachment(supabase, att))
      )

      return { ...entry, entry_attachments }
    })
  )
}
