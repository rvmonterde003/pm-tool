import type { SupabaseClient } from '@supabase/supabase-js'
import type { Entry, EntryAttachment } from '@/types'

const SIGNED_URL_TTL_SECONDS = 3600

/**
 * Signs every attachment across all entries in a single batched Storage request
 * instead of one network round-trip per attachment. The `download` filename is
 * appended per-file afterwards because it is not part of the signed token.
 */
export async function signEntryAttachments(
  supabase: SupabaseClient,
  entries: Entry[]
): Promise<Entry[]> {
  const attachments = entries.flatMap(entry => entry.entry_attachments ?? [])
  if (attachments.length === 0) return entries

  const paths = attachments.map(att => att.file_url)
  const { data: signed } = await supabase.storage
    .from('attachments')
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS)

  const signedByPath = new Map<string, string>()
  for (const item of signed ?? []) {
    if (item.path && item.signedUrl) signedByPath.set(item.path, item.signedUrl)
  }

  const resolve = (att: EntryAttachment): EntryAttachment => {
    const base = signedByPath.get(att.file_url)
    if (!base) return { ...att, signedUrl: null }
    const signedUrl = `${base}&download=${encodeURIComponent(att.file_name)}`
    return { ...att, signedUrl }
  }

  return entries.map(entry => {
    if (!entry.entry_attachments?.length) return entry
    return { ...entry, entry_attachments: entry.entry_attachments.map(resolve) }
  })
}
