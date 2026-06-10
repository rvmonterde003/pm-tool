export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  created_at: string
}

export interface Project {
  id: string
  name: string
  created_by: string
  progress: number
  cover_url: string | null
  invite_token: string
  created_at: string
}

export interface ProjectWithMembers extends Project {
  project_members: { user_id: string; profiles: Profile }[]
}

export interface Entry {
  id: string
  project_id: string
  author_id: string
  week_start: string
  what_shipped: string
  what_slipped: string
  whats_blocking: string
  created_at: string
  entry_attachments?: EntryAttachment[]
  profiles?: Profile
}

export interface EntryAttachment {
  id: string
  entry_id: string
  file_url: string
  file_name: string
  uploaded_by: string
  created_at: string
  signedUrl?: string | null
}

export interface ProjectInvite {
  id: string
  project_id: string
  invited_email: string
  token: string
  accepted_at: string | null
  created_at: string
}

export type ActionResult<T> = { data: T; error: null } | { data: null; error: string }

export type ProcurementRemarks = 'delivered' | 'purchased' | 'waiting'

export interface ProcurementItem {
  id: string
  item_name: string
  qty: number
  specification: string
  usage: string
  sample_link: string | null
  remarks: ProcurementRemarks
  created_by: string | null
  created_at: string
}

export type WorkStatus = 'wfh' | 'on-leave' | 'in-office'

export interface EngineerAttendance {
  id: string
  user_id: string
  attendance_date: string
  status: WorkStatus
  created_at: string
}

export interface EngineerWithStatus extends Profile {
  today_status: WorkStatus | null
}
