'use client'

import { useState, useTransition } from 'react'
import { CoverUpload } from './cover-upload'
import { updateProgress, deleteProject } from '@/lib/actions/projects'
import { sendEmailInvite } from '@/lib/actions/members'
import { cn } from '@/lib/utils/cn'
import { useRouter } from 'next/navigation'
import type { ProjectWithMembers } from '@/types'

export function LeftPanel({
  project,
  isCreator,
}: {
  project: ProjectWithMembers
  isCreator: boolean
}) {
  const router = useRouter()
  const [progress, setProgress] = useState(String(project.progress))
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMsg, setInviteMsg] = useState('')
  const [isPendingProgress, startProgress] = useTransition()
  const [isPendingInvite, startInvite] = useTransition()
  const [isPendingDelete, startDelete] = useTransition()

  const shareUrl = `${window.location.origin}/invite/${project.invite_token}`

  function handleProgressBlur() {
    const val = parseInt(progress, 10)
    if (isNaN(val)) { setProgress(String(project.progress)); return }
    const clamped = Math.max(0, Math.min(100, val))
    setProgress(String(clamped))
    startProgress(async () => {
      await updateProgress({ projectId: project.id, progress: clamped })
    })
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteMsg('')
    startInvite(async () => {
      const result = await sendEmailInvite({ projectId: project.id, email: inviteEmail })
      if (result.error) { setInviteMsg(result.error); return }
      setInviteMsg('Invite sent!')
      setInviteEmail('')
    })
  }

  function handleDelete() {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return
    startDelete(async () => {
      await deleteProject(project.id)
      router.push('/dashboard')
    })
  }

  return (
    <aside className="w-80 shrink-0 space-y-6 bg-panel border border-border rounded-2xl p-6 self-start sticky top-20">
      <div>
        <h1 className="text-xl font-bold text-text-primary">{project.name}</h1>
      </div>

      <CoverUpload projectId={project.id} currentCoverUrl={project.cover_url} />

      {/* Progress */}
      <div>
        <label className="block text-xs text-text-muted uppercase tracking-widest mb-1">Progress</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={e => setProgress(e.target.value)}
            onBlur={handleProgressBlur}
            disabled={isPendingProgress}
            className={cn(
              'w-20 bg-surface border border-border rounded-lg px-3 py-2 text-lg font-bold text-orange text-center',
              'outline-none focus:border-orange focus:shadow-orange transition-all'
            )}
          />
          <span className="text-lg font-bold text-orange">%</span>
        </div>
      </div>

      {/* Collaborators */}
      <div>
        <label className="block text-xs text-text-muted uppercase tracking-widest mb-2">Members</label>
        <ul className="space-y-1">
          {project.project_members.map(m => (
            <li key={m.user_id} className="text-sm text-text-primary">{m.profiles.display_name}</li>
          ))}
        </ul>
      </div>

      {/* Invite */}
      <div className="space-y-2">
        <label className="block text-xs text-text-muted uppercase tracking-widest">Invite</label>
        <form onSubmit={handleInvite} className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="Email address"
            required
            className={cn(
              'flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text-primary',
              'outline-none focus:border-orange transition-all placeholder:text-text-muted'
            )}
          />
          <button
            type="submit"
            disabled={isPendingInvite}
            className="px-3 py-2 bg-orange text-black text-xs font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
          >
            Send
          </button>
        </form>
        {inviteMsg && <p className="text-xs text-text-muted">{inviteMsg}</p>}
        <button
          onClick={() => { navigator.clipboard.writeText(shareUrl); setInviteMsg('Link copied!') }}
          className="w-full text-xs py-2 border border-border rounded-lg text-text-muted hover:border-orange hover:text-orange transition-colors"
        >
          Copy shareable link
        </button>
      </div>

      {isCreator && (
        <button
          onClick={handleDelete}
          disabled={isPendingDelete}
          className="w-full text-xs py-2 border border-red-900 text-red-500 rounded-lg hover:bg-red-950 transition-colors disabled:opacity-50"
        >
          Delete project
        </button>
      )}
    </aside>
  )
}
