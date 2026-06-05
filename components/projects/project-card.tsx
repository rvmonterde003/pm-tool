'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/types'

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()
  const isComplete = project.progress === 100

  return (
    <button
      onClick={() => router.push(`/projects/${project.id}`)}
      className={cn(
        'relative w-full aspect-[4/3] rounded-2xl overflow-hidden',
        'border border-border hover:border-orange/50 transition-all duration-200',
        'focus:outline-none focus:border-orange focus:shadow-orange',
        isComplete && 'ring-1 ring-orange shadow-orange'
      )}
    >
      {project.cover_url ? (
        <Image
          src={project.cover_url}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}

      {!isComplete && (
        <div className="absolute inset-0 bg-black/60" />
      )}

      <span
        className="absolute bottom-3 left-3 text-sm font-semibold text-text-primary"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
      >
        {project.name}
      </span>

      <span className="absolute bottom-3 right-3 text-base font-bold text-orange">
        {project.progress}%
      </span>
    </button>
  )
}
