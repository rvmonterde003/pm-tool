# Realign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended), superpowers:executing-plans, or superpowers:manual-fan-out-dispatch to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Realign — a collaborative project management app where teams log weekly entries (what shipped, what slipped, what's blocking) against image-backed project cards on a futuristic honeycomb canvas.

**Architecture:** Next.js 14 App Router with server components for initial data fetch, Supabase SSR client for server-side queries, and Supabase Realtime subscriptions on the client for live collaborative updates. Mutations are handled via Next.js Server Actions. File uploads go to Supabase Storage.

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS v3 · Supabase (Auth + DB + Storage + Realtime) · Resend (email) · Vitest · date-fns · clsx + tailwind-merge

---

## File Map

```
pm-project-mgmt/
├── app/
│   ├── layout.tsx                          # Root layout (Inter font)
│   ├── page.tsx                            # Auth landing (sign-in)
│   ├── (app)/
│   │   ├── layout.tsx                      # App shell (honeycomb bg, auth guard)
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # Main project grid (server component)
│   │   └── projects/
│   │       └── [id]/
│   │           └── page.tsx                # Project detail (server component)
│   ├── invite/
│   │   └── [token]/
│   │       └── page.tsx                    # Invite landing + join flow
│   └── api/
│       └── invite/
│           └── route.ts                    # POST — send email invite via Resend
├── components/
│   ├── ui/
│   │   ├── honeycomb-bg.tsx                # SVG honeycomb tiled background
│   │   └── toast.tsx                       # Inline toast notification
│   ├── projects/
│   │   ├── project-card.tsx                # Image card with overlay + name + progress
│   │   ├── new-project-card.tsx            # Dashed "+" card
│   │   ├── new-project-modal.tsx           # Create project form modal
│   │   └── project-grid.tsx                # 3-column responsive grid
│   ├── detail/
│   │   ├── left-panel.tsx                  # Cover, progress, collaborators, invite
│   │   ├── cover-upload.tsx                # Replace/remove cover controls
│   │   └── right-panel.tsx                 # Entries feed + pagination
│   └── entries/
│       ├── entry-card.tsx                  # Bento entry card
│       ├── entries-feed.tsx                # Monthly paginated list
│       └── add-entry-modal.tsx             # Create entry form
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser Supabase client (singleton)
│   │   └── server.ts                       # Server Supabase client (per-request)
│   ├── actions/
│   │   ├── projects.ts                     # createProject, deleteProject, updateProgress
│   │   ├── entries.ts                      # createEntry (with week validation)
│   │   ├── members.ts                      # sendEmailInvite, joinViaToken
│   │   └── storage.ts                      # uploadCover, deleteCover, uploadAttachment
│   └── utils/
│       ├── cn.ts                           # Tailwind class merge helper
│       └── week.ts                         # getCurrentMonday() — ISO Monday of current week
├── types/
│   └── index.ts                            # All shared TypeScript types
├── middleware.ts                            # Protect /dashboard and /projects/* routes
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql                  # All tables
│       └── 002_rls.sql                     # Row-Level Security policies
├── tailwind.config.ts                      # Custom colors, fonts
├── next.config.ts
├── vitest.config.ts
├── .env.local.example
└── package.json
```

---

## Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `vitest.config.ts`, `.env.local.example`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd "C:\Users\Admin\Desktop\Personal Projects"
npx create-next-app@latest pm-project-mgmt \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
cd pm-project-mgmt
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr date-fns clsx tailwind-merge resend
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Tailwind with design tokens**

Replace `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#111111',
        canvas: '#1a1a1a',
        surface: '#1e1e1e',
        panel: '#252525',
        border: '#2e2e2e',
        'text-primary': '#f0f0f0',
        'text-muted': '#6b6b6b',
        orange: '#ff6b00',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        orange: '0 0 8px #ff6b00',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
})
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Create `.env.local.example`**

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Copy to `.env.local` and fill in values from your Supabase project dashboard.

- [ ] **Step 6: Update `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind + Vitest config"
```

---

## Task 2: Supabase Schema Migrations

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create migration file**

Create `supabase/migrations/001_schema.sql`:

```sql
-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create profile on user sign-up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references profiles(id) on delete cascade,
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  cover_url text,
  invite_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now()
);

-- Project members (many-to-many)
create table project_members (
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- Auto-add creator as member
create or replace function add_creator_as_member()
returns trigger as $$
begin
  insert into project_members (project_id, user_id)
  values (new.id, new.created_by);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_created
  after insert on projects
  for each row execute procedure add_creator_as_member();

-- Entries
create table entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  week_start date not null,
  what_shipped text not null default '',
  what_slipped text not null default '',
  whats_blocking text not null default '',
  created_at timestamptz not null default now()
);

-- Entry attachments
create table entry_attachments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  uploaded_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Project invites (email-based)
create table project_invites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  invited_email text not null,
  token uuid not null default gen_random_uuid() unique,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
```

- [ ] **Step 2: Run migration in Supabase dashboard**

Go to your Supabase project → SQL Editor → paste the contents of `001_schema.sql` → Run.

Verify all 6 tables appear in Table Editor: `profiles`, `projects`, `project_members`, `entries`, `entry_attachments`, `project_invites`.

- [ ] **Step 3: Create Storage buckets**

In Supabase dashboard → Storage → New bucket:
1. Name: `covers` — Public: ON
2. Name: `attachments` — Public: OFF

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema migration"
```

---

## Task 3: Row-Level Security Policies

**Files:**
- Create: `supabase/migrations/002_rls.sql`

- [ ] **Step 1: Create RLS migration**

Create `supabase/migrations/002_rls.sql`:

```sql
-- Helper: is the current user a member of a project?
create or replace function is_project_member(p_project_id uuid)
returns boolean as $$
  select exists (
    select 1 from project_members
    where project_id = p_project_id
      and user_id = auth.uid()
  );
$$ language sql security definer;

-- PROFILES
alter table profiles enable row level security;
create policy "Users can read all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- PROJECTS
alter table projects enable row level security;
create policy "Members can read projects" on projects for select
  using (is_project_member(id));
create policy "Authenticated users can create projects" on projects for insert
  with check (auth.uid() = created_by);
create policy "Members can update projects" on projects for update
  using (is_project_member(id));
create policy "Only creator can delete project" on projects for delete
  using (auth.uid() = created_by);

-- PROJECT_MEMBERS
alter table project_members enable row level security;
create policy "Members can read project members" on project_members for select
  using (is_project_member(project_id));
create policy "Service role can insert members" on project_members for insert
  with check (auth.uid() = user_id);

-- ENTRIES
alter table entries enable row level security;
create policy "Members can read entries" on entries for select
  using (is_project_member(project_id));
create policy "Members can create entries" on entries for insert
  with check (is_project_member(project_id) and auth.uid() = author_id);

-- ENTRY_ATTACHMENTS
alter table entry_attachments enable row level security;
create policy "Members can read attachments" on entry_attachments for select
  using (
    exists (
      select 1 from entries e
      where e.id = entry_id and is_project_member(e.project_id)
    )
  );
create policy "Members can insert attachments" on entry_attachments for insert
  with check (
    auth.uid() = uploaded_by and
    exists (
      select 1 from entries e
      where e.id = entry_id and is_project_member(e.project_id)
    )
  );

-- PROJECT_INVITES
alter table project_invites enable row level security;
create policy "Invite tokens are publicly readable" on project_invites for select
  using (true);
create policy "Members can create invites" on project_invites for insert
  with check (is_project_member(project_id));
create policy "Accept own invite" on project_invites for update
  using (true);

-- STORAGE: covers bucket (public read, member write)
create policy "Public can read covers" on storage.objects for select
  using (bucket_id = 'covers');
create policy "Members can upload covers" on storage.objects for insert
  with check (
    bucket_id = 'covers' and auth.role() = 'authenticated'
  );
create policy "Members can delete covers" on storage.objects for delete
  using (bucket_id = 'covers' and auth.role() = 'authenticated');

-- STORAGE: attachments bucket (member read via signed URL, member write)
create policy "Members can upload attachments" on storage.objects for insert
  with check (bucket_id = 'attachments' and auth.role() = 'authenticated');
create policy "Members can read attachments" on storage.objects for select
  using (bucket_id = 'attachments' and auth.role() = 'authenticated');
```

- [ ] **Step 2: Run in Supabase SQL Editor**

Paste `002_rls.sql` into Supabase SQL Editor → Run.

Verify no errors. Check Authentication → Policies in the dashboard to confirm policies appear on all tables.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/002_rls.sql
git commit -m "feat: add row-level security policies"
```

---

## Task 4: Supabase Clients, Middleware & Shared Types

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `middleware.ts`, `types/index.ts`

- [ ] **Step 1: Write failing test for types shape**

Create `types/index.test.ts`:

```ts
import { describe, it, expectTypeOf } from 'vitest'
import type { Project, Entry, Profile } from './index'

describe('types', () => {
  it('Project has required fields', () => {
    expectTypeOf<Project>().toHaveProperty('id')
    expectTypeOf<Project>().toHaveProperty('name')
    expectTypeOf<Project>().toHaveProperty('progress')
    expectTypeOf<Project>().toHaveProperty('cover_url')
  })

  it('Entry has week_start and three text fields', () => {
    expectTypeOf<Entry>().toHaveProperty('week_start')
    expectTypeOf<Entry>().toHaveProperty('what_shipped')
    expectTypeOf<Entry>().toHaveProperty('what_slipped')
    expectTypeOf<Entry>().toHaveProperty('whats_blocking')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run types/index.test.ts
```

Expected: FAIL — `Cannot find module './index'`

- [ ] **Step 3: Create shared types**

Create `types/index.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run types/index.test.ts
```

Expected: PASS

- [ ] **Step 5: Create browser Supabase client**

Create `lib/supabase/client.ts`:

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 6: Create server Supabase client**

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 7: Create route protection middleware**

Create `middleware.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/projects')

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*'],
}
```

- [ ] **Step 8: Commit**

```bash
git add lib/ middleware.ts types/
git commit -m "feat: add Supabase clients, middleware, and shared types"
```

---

## Task 5: Utility Functions

**Files:**
- Create: `lib/utils/cn.ts`, `lib/utils/week.ts`
- Test: `lib/utils/week.test.ts`

- [ ] **Step 1: Write failing tests for week utility**

Create `lib/utils/week.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getCurrentMonday, getWeekRange } from './week'

describe('getCurrentMonday', () => {
  it('returns a Monday for a Wednesday input', () => {
    // 2026-06-03 is a Wednesday
    const result = getCurrentMonday(new Date('2026-06-03'))
    expect(result).toBe('2026-06-01') // Monday
  })

  it('returns the same day when input is a Monday', () => {
    const result = getCurrentMonday(new Date('2026-06-01'))
    expect(result).toBe('2026-06-01')
  })

  it('returns the correct Monday for a Sunday (end of week)', () => {
    // 2026-06-07 is a Sunday
    const result = getCurrentMonday(new Date('2026-06-07'))
    expect(result).toBe('2026-06-01')
  })
})

describe('getWeekRange', () => {
  it('returns Mon–Sun range string for a given Monday', () => {
    const result = getWeekRange('2026-06-01')
    expect(result).toBe('Jun 1 – Jun 7, 2026')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/utils/week.test.ts
```

Expected: FAIL — `Cannot find module './week'`

- [ ] **Step 3: Implement week utilities**

Create `lib/utils/week.ts`:

```ts
import { startOfISOWeek, endOfISOWeek, format, parseISO } from 'date-fns'

export function getCurrentMonday(date: Date = new Date()): string {
  return format(startOfISOWeek(date), 'yyyy-MM-dd')
}

export function getWeekRange(mondayStr: string): string {
  const monday = parseISO(mondayStr)
  const sunday = endOfISOWeek(monday)
  if (monday.getMonth() === sunday.getMonth()) {
    return `${format(monday, 'MMM d')} – ${format(sunday, 'd, yyyy')}`
  }
  return `${format(monday, 'MMM d')} – ${format(sunday, 'MMM d, yyyy')}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/utils/week.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Create cn utility**

Create `lib/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/utils/
git commit -m "feat: add week and cn utility functions"
```

---

## Task 6: Root Layout & Auth Page

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: Update root layout with Inter font**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Realign',
  description: 'Collaborative project tracking',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-page text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Update globals.css**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #2e2e2e;
  border-radius: 3px;
}
```

- [ ] **Step 3: Create Auth page**

Create `app/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-page flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-text-primary">Realign</h1>
          <p className="mt-2 text-sm text-text-muted">Track what shipped, what slipped, what&apos;s blocking.</p>
        </div>
        <AuthForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Create AuthForm client component**

Create `components/auth/auth-form.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/dashboard` },
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for a sign-in link.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs text-text-muted mb-1 uppercase tracking-widest">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={cn(
            'w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-primary',
            'placeholder:text-text-muted outline-none',
            'focus:border-orange focus:shadow-orange transition-all duration-150'
          )}
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full bg-orange text-black font-semibold text-sm py-3 rounded-lg',
          'hover:brightness-110 transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {loading ? 'Sending…' : 'Send sign-in link'}
      </button>
      {message && (
        <p className="text-xs text-center text-text-muted">{message}</p>
      )}
    </form>
  )
}
```

- [ ] **Step 5: Update `app/page.tsx` to import AuthForm**

Replace `app/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthForm } from '@/components/auth/auth-form'

export default async function AuthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-page flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-text-primary">Realign</h1>
          <p className="mt-2 text-sm text-text-muted">Track what shipped, what slipped, what&apos;s blocking.</p>
        </div>
        <AuthForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add app/ components/auth/
git commit -m "feat: add root layout and magic-link auth page"
```

---

## Task 7: Honeycomb Background & App Shell

**Files:**
- Create: `components/ui/honeycomb-bg.tsx`, `app/(app)/layout.tsx`

- [ ] **Step 1: Create HoneycombBg component**

Create `components/ui/honeycomb-bg.tsx`:

```tsx
export function HoneycombBg() {
  return (
    <div
      className="fixed inset-0 -z-10 bg-canvas"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0-6l22-12.7V23.7L28 11 6 23.7v23.6L28 60z' fill='%23222222' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '56px 100px',
      }}
    />
  )
}
```

- [ ] **Step 2: Create app shell layout**

Create `app/(app)/layout.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HoneycombBg } from '@/components/ui/honeycomb-bg'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen relative">
      <HoneycombBg />
      <nav className="border-b border-border bg-page/80 backdrop-blur-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-black tracking-tight text-text-primary">Realign</span>
        <SignOutButton />
      </nav>
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Create SignOutButton client component**

Create `components/auth/sign-out-button.tsx`:

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-text-muted hover:text-text-primary transition-colors"
    >
      Sign out
    </button>
  )
}
```

- [ ] **Step 4: Import SignOutButton in app layout**

Update `app/(app)/layout.tsx` to import SignOutButton:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HoneycombBg } from '@/components/ui/honeycomb-bg'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen relative">
      <HoneycombBg />
      <nav className="border-b border-border bg-page/80 backdrop-blur-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-black tracking-tight text-text-primary">Realign</span>
        <SignOutButton />
      </nav>
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/ app/\(app\)/
git commit -m "feat: add honeycomb background and authenticated app shell"
```

---

## Task 8: Server Actions — Projects

**Files:**
- Create: `lib/actions/projects.ts`
- Test: `lib/actions/projects.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/actions/projects.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: vi.fn(() => ({ getAll: () => [], setAll: () => {} })) }))

import { createProject, updateProgress } from './projects'
import { createClient } from '@/lib/supabase/server'

describe('createProject', () => {
  it('returns error when name is empty', async () => {
    const result = await createProject({ name: '', coverFile: null })
    expect(result.error).toBe('Project name is required.')
  })
})

describe('updateProgress', () => {
  it('returns error when progress is out of range', async () => {
    const result = await updateProgress({ projectId: 'abc', progress: 150 })
    expect(result.error).toBe('Progress must be between 0 and 100.')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/actions/projects.test.ts
```

Expected: FAIL — `Cannot find module './projects'`

- [ ] **Step 3: Implement project actions**

Create `lib/actions/projects.ts`:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Project } from '@/types'

export async function createProject({
  name,
  coverFile,
}: {
  name: string
  coverFile: File | null
}): Promise<ActionResult<Project>> {
  if (!name.trim()) return { data: null, error: 'Project name is required.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  let cover_url: string | null = null

  if (coverFile) {
    const ext = coverFile.name.split('.').pop()
    const path = `covers/${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(path, coverFile, { upsert: false })
    if (uploadError) return { data: null, error: uploadError.message }

    const { data: urlData } = supabase.storage.from('covers').getPublicUrl(path)
    cover_url = urlData.publicUrl
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ name: name.trim(), created_by: user.id, cover_url })
    .select()
    .single()

  if (error) return { data: null, error: error.message }

  revalidatePath('/dashboard')
  return { data, error: null }
}

export async function deleteProject(projectId: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('created_by', user.id)

  if (error) return { data: null, error: error.message }

  revalidatePath('/dashboard')
  return { data: null, error: null }
}

export async function updateProgress({
  projectId,
  progress,
}: {
  projectId: string
  progress: number
}): Promise<ActionResult<null>> {
  if (progress < 0 || progress > 100) {
    return { data: null, error: 'Progress must be between 0 and 100.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ progress })
    .eq('id', projectId)

  if (error) return { data: null, error: error.message }

  revalidatePath(`/projects/${projectId}`)
  return { data: null, error: null }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/actions/projects.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/actions/projects.ts lib/actions/projects.test.ts
git commit -m "feat: add project server actions (create, delete, updateProgress)"
```

---

## Task 9: Server Actions — Entries

**Files:**
- Create: `lib/actions/entries.ts`
- Test: `lib/actions/entries.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/actions/entries.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: vi.fn(() => ({ getAll: () => [], setAll: () => {} })) }))

import { createEntry } from './entries'

describe('createEntry', () => {
  it('returns error when all three text fields are empty', async () => {
    const result = await createEntry({
      projectId: 'proj-1',
      whatShipped: '',
      whatSlipped: '',
      whatsBlocking: '',
      attachments: [],
    })
    expect(result.error).toBe('At least one field (shipped, slipped, or blocking) is required.')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run lib/actions/entries.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement entry action**

Create `lib/actions/entries.ts`:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMonday } from '@/lib/utils/week'
import type { ActionResult, Entry } from '@/types'

export async function createEntry({
  projectId,
  whatShipped,
  whatSlipped,
  whatsBlocking,
  attachments,
}: {
  projectId: string
  whatShipped: string
  whatSlipped: string
  whatsBlocking: string
  attachments: File[]
}): Promise<ActionResult<Entry>> {
  if (!whatShipped.trim() && !whatSlipped.trim() && !whatsBlocking.trim()) {
    return { data: null, error: 'At least one field (shipped, slipped, or blocking) is required.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const weekStart = getCurrentMonday()

  // Enforce max 2 entries per week
  const { count } = await supabase
    .from('entries')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('week_start', weekStart)

  if ((count ?? 0) >= 2) {
    return { data: null, error: 'Maximum 2 entries per week reached.' }
  }

  const { data: entry, error: entryError } = await supabase
    .from('entries')
    .insert({
      project_id: projectId,
      author_id: user.id,
      week_start: weekStart,
      what_shipped: whatShipped.trim(),
      what_slipped: whatSlipped.trim(),
      whats_blocking: whatsBlocking.trim(),
    })
    .select()
    .single()

  if (entryError) return { data: null, error: entryError.message }

  // Upload attachments
  for (const file of attachments) {
    const ext = file.name.split('.').pop()
    const path = `attachments/${entry.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(path, file)

    if (!uploadError) {
      await supabase.from('entry_attachments').insert({
        entry_id: entry.id,
        file_url: path,
        file_name: file.name,
        uploaded_by: user.id,
      })
    }
  }

  revalidatePath(`/projects/${projectId}`)
  return { data: entry, error: null }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run lib/actions/entries.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/actions/entries.ts lib/actions/entries.test.ts
git commit -m "feat: add entry server action with 2-per-week validation"
```

---

## Task 10: Server Actions — Members & Invites + Email API Route

**Files:**
- Create: `lib/actions/members.ts`, `app/api/invite/route.ts`

- [ ] **Step 1: Create members action**

Create `lib/actions/members.ts`:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types'

export async function joinViaToken(token: string): Promise<ActionResult<{ projectId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  // Check project invite token first
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('invite_token', token)
    .single()

  let projectId: string | null = null

  if (project) {
    projectId = project.id
  } else {
    // Check email-based invite
    const { data: invite } = await supabase
      .from('project_invites')
      .select('project_id')
      .eq('token', token)
      .is('accepted_at', null)
      .single()

    if (!invite) return { data: null, error: 'Invalid or expired invite link.' }

    projectId = invite.project_id

    // Mark invite as accepted
    await supabase
      .from('project_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)
  }

  // Add to project_members (ignore if already a member)
  const { error } = await supabase
    .from('project_members')
    .upsert({ project_id: projectId, user_id: user.id }, { onConflict: 'project_id,user_id' })

  if (error) return { data: null, error: error.message }

  revalidatePath(`/projects/${projectId}`)
  return { data: { projectId }, error: null }
}

export async function sendEmailInvite({
  projectId,
  email,
}: {
  projectId: string
  email: string
}): Promise<ActionResult<null>> {
  if (!email.includes('@')) return { data: null, error: 'Invalid email address.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  const { data: invite, error: insertError } = await supabase
    .from('project_invites')
    .insert({ project_id: projectId, invited_email: email })
    .select()
    .single()

  if (insertError) return { data: null, error: insertError.message }

  // Trigger email send
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token: invite.token, projectId }),
  })

  if (!response.ok) return { data: null, error: 'Failed to send email.' }

  return { data: null, error: null }
}
```

- [ ] **Step 2: Create email invite API route**

Create `app/api/invite/route.ts`:

```ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, token } = await request.json()

  if (!email || !token) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`

  const { error } = await resend.emails.send({
    from: 'Realign <noreply@yourdomain.com>',
    to: email,
    subject: "You've been invited to a Realign project",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 900; color: #f0f0f0;">Realign</h1>
        <p style="color: #6b6b6b;">You've been invited to collaborate on a project.</p>
        <a href="${inviteUrl}"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px;
                  background: #ff6b00; color: #000; font-weight: 600;
                  border-radius: 8px; text-decoration: none;">
          Accept invite
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #6b6b6b;">
          Or copy this link: ${inviteUrl}
        </p>
      </div>
    `,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/actions/members.ts app/api/
git commit -m "feat: add member invite actions and email API route"
```

---

## Task 11: Project Card Components & New Project Modal

**Files:**
- Create: `components/projects/project-card.tsx`, `components/projects/new-project-card.tsx`, `components/projects/new-project-modal.tsx`

- [ ] **Step 1: Create ProjectCard**

Create `components/projects/project-card.tsx`:

```tsx
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

      {/* Dark overlay — removed at 100% */}
      {!isComplete && (
        <div className="absolute inset-0 bg-black/60" />
      )}

      {/* Project name — bottom left */}
      <span
        className="absolute bottom-3 left-3 text-sm font-semibold text-text-primary"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
      >
        {project.name}
      </span>

      {/* Progress — bottom right */}
      <span className="absolute bottom-3 right-3 text-base font-bold text-orange">
        {project.progress}%
      </span>
    </button>
  )
}
```

- [ ] **Step 2: Create NewProjectCard**

Create `components/projects/new-project-card.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { NewProjectModal } from './new-project-modal'

export function NewProjectCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-border hover:border-orange/50 transition-colors flex flex-col items-center justify-center gap-2 group"
      >
        <span className="text-3xl text-text-muted group-hover:text-orange transition-colors">+</span>
        <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors">New Project</span>
      </button>
      <NewProjectModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
```

- [ ] **Step 3: Create NewProjectModal**

Create `components/projects/new-project-modal.tsx`:

```tsx
'use client'

import { useRef, useState, useTransition } from 'react'
import { createProject } from '@/lib/actions/projects'
import { cn } from '@/lib/utils/cn'

export function NewProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await createProject({ name, coverFile })
      if (result.error) { setError(result.error); return }
      setName(''); setCoverFile(null); setPreview(null)
      onClose()
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">New project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-widest">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={cn(
                'w-full bg-panel border border-border rounded-lg px-4 py-3 text-sm text-text-primary',
                'outline-none focus:border-orange focus:shadow-orange transition-all'
              )}
              placeholder="Project name"
            />
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-1 uppercase tracking-widest">Cover image</label>
            {preview ? (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                <img src={preview} alt="preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => { setCoverFile(null); setPreview(null) }}
                  className="absolute top-2 right-2 bg-black/60 text-text-muted hover:text-text-primary text-xs px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-orange/50 flex items-center justify-center text-xs text-text-muted transition-colors"
              >
                Upload cover
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {error && <p className="text-xs text-orange border border-orange/30 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-text-muted border border-border rounded-lg hover:border-text-muted transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 py-2 text-sm font-semibold bg-orange text-black rounded-lg hover:brightness-110 disabled:opacity-50 transition-all">
              {isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/projects/
git commit -m "feat: add project card, new project card, and create modal"
```

---

## Task 12: Dashboard Page

**Files:**
- Create: `app/(app)/dashboard/page.tsx`, `components/projects/project-grid.tsx`

- [ ] **Step 1: Create ProjectGrid**

Create `components/projects/project-grid.tsx`:

```tsx
import { ProjectCard } from './project-card'
import { NewProjectCard } from './new-project-card'
import type { Project } from '@/types'

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <NewProjectCard />
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create Dashboard page**

Create `app/(app)/dashboard/page.tsx`:

```tsx
import { createClient } from '@/lib/supabase/server'
import { ProjectGrid } from '@/components/projects/project-grid'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="px-6 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
        <p className="text-sm text-text-muted mt-1">All projects you&apos;re a member of</p>
      </div>
      <ProjectGrid projects={projects ?? []} />
    </div>
  )
}
```

- [ ] **Step 3: Verify the app renders**

```bash
npm run dev
```

Open `http://localhost:3000` — should show sign-in page. Sign in with a magic link. Should redirect to `/dashboard` with honeycomb bg and "New Project" card visible.

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/dashboard/ components/projects/project-grid.tsx
git commit -m "feat: add dashboard page with project grid"
```

---

## Task 13: Project Detail — Left Panel

**Files:**
- Create: `components/detail/left-panel.tsx`, `components/detail/cover-upload.tsx`
- Modify: `lib/actions/projects.ts` (add `updateCover` action)

- [ ] **Step 1: Add updateCover action to `lib/actions/projects.ts`**

Append to `lib/actions/projects.ts`:

```ts
export async function updateCover({
  projectId,
  oldCoverUrl,
  newCoverFile,
}: {
  projectId: string
  oldCoverUrl: string | null
  newCoverFile: File | null
}): Promise<ActionResult<{ cover_url: string | null }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not authenticated.' }

  // Delete old cover if it exists
  if (oldCoverUrl) {
    const path = oldCoverUrl.split('/storage/v1/object/public/covers/')[1]
    if (path) await supabase.storage.from('covers').remove([path])
  }

  let cover_url: string | null = null

  if (newCoverFile) {
    const ext = newCoverFile.name.split('.').pop()
    const path = `covers/${user.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(path, newCoverFile)
    if (uploadError) return { data: null, error: uploadError.message }
    const { data: urlData } = supabase.storage.from('covers').getPublicUrl(path)
    cover_url = urlData.publicUrl
  }

  const { error } = await supabase
    .from('projects')
    .update({ cover_url })
    .eq('id', projectId)

  if (error) return { data: null, error: error.message }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/dashboard')
  return { data: { cover_url }, error: null }
}
```

- [ ] **Step 2: Create CoverUpload component**

Create `components/detail/cover-upload.tsx`:

```tsx
'use client'

import { useRef, useTransition } from 'react'
import Image from 'next/image'
import { updateCover } from '@/lib/actions/projects'
import { cn } from '@/lib/utils/cn'

export function CoverUpload({
  projectId,
  currentCoverUrl,
}: {
  projectId: string
  currentCoverUrl: string | null
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    startTransition(async () => {
      await updateCover({ projectId, oldCoverUrl: currentCoverUrl, newCoverFile: file })
    })
  }

  function handleRemove() {
    startTransition(async () => {
      await updateCover({ projectId, oldCoverUrl: currentCoverUrl, newCoverFile: null })
    })
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs text-text-muted uppercase tracking-widest">Cover image</label>
      <div className={cn('relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border', isPending && 'opacity-50')}>
        {currentCoverUrl ? (
          <Image src={currentCoverUrl} alt="Project cover" fill className="object-cover" sizes="400px" />
        ) : (
          <div className="w-full h-full bg-panel flex items-center justify-center">
            <span className="text-xs text-text-muted">No cover</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="flex-1 text-xs py-2 border border-border rounded-lg text-text-muted hover:border-orange hover:text-orange transition-colors disabled:opacity-50"
        >
          {currentCoverUrl ? 'Replace' : 'Upload'}
        </button>
        {currentCoverUrl && (
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="flex-1 text-xs py-2 border border-border rounded-lg text-text-muted hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
```

- [ ] **Step 3: Create LeftPanel**

Create `components/detail/left-panel.tsx`:

```tsx
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
```

- [ ] **Step 4: Commit**

```bash
git add components/detail/ lib/actions/projects.ts
git commit -m "feat: add project detail left panel with cover upload, progress, invite"
```

---

## Task 14: Entry Components

**Files:**
- Create: `components/entries/entry-card.tsx`, `components/entries/add-entry-modal.tsx`

- [ ] **Step 1: Create EntryCard**

Create `components/entries/entry-card.tsx`:

```tsx
import { getWeekRange } from '@/lib/utils/week'
import type { Entry } from '@/types'

function BentoCell({ label, content }: { label: string; content: string }) {
  if (!content) return null
  return (
    <div className="p-4 border-b border-border last:border-b-0">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-text-primary whitespace-pre-wrap">{content}</p>
    </div>
  )
}

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <span className="text-xs text-text-muted">{getWeekRange(entry.week_start)}</span>
        {entry.profiles && (
          <span className="text-xs text-text-muted ml-2">· {entry.profiles.display_name}</span>
        )}
      </div>
      <BentoCell label="What shipped" content={entry.what_shipped} />
      <BentoCell label="What slipped & why" content={entry.what_slipped} />
      <BentoCell label="What's blocking" content={entry.whats_blocking} />
      {entry.entry_attachments && entry.entry_attachments.length > 0 && (
        <div className="px-4 py-3 border-t border-border flex flex-wrap gap-2">
          {entry.entry_attachments.map(att => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-panel border border-border rounded-full text-xs text-text-muted"
            >
              📎 {att.file_name}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
```

- [ ] **Step 2: Create AddEntryModal**

Create `components/entries/add-entry-modal.tsx`:

```tsx
'use client'

import { useRef, useState, useTransition } from 'react'
import { createEntry } from '@/lib/actions/entries'
import { cn } from '@/lib/utils/cn'

export function AddEntryModal({
  projectId,
  open,
  onClose,
  weeklyCount,
}: {
  projectId: string
  open: boolean
  onClose: () => void
  weeklyCount: number
}) {
  const [shipped, setShipped] = useState('')
  const [slipped, setSlipped] = useState('')
  const [blocking, setBlocking] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const atLimit = weeklyCount >= 2

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    setFiles(prev => [...prev, ...selected])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const result = await createEntry({
        projectId,
        whatShipped: shipped,
        whatSlipped: slipped,
        whatsBlocking: blocking,
        attachments: files,
      })
      if (result.error) { setError(result.error); return }
      setShipped(''); setSlipped(''); setBlocking(''); setFiles([])
      onClose()
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg space-y-4 mx-4">
        <h2 className="text-lg font-semibold text-text-primary">Add entry</h2>

        {atLimit ? (
          <p className="text-sm text-text-muted border border-border rounded-lg p-4">
            Maximum 2 entries reached for this week.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'What shipped', value: shipped, set: setShipped, placeholder: 'Features, fixes, or releases that went out…' },
              { label: 'What slipped & why', value: slipped, set: setSlipped, placeholder: 'What didn\'t make it and why…' },
              { label: "What's blocking", value: blocking, set: setBlocking, placeholder: 'Current blockers or dependencies…' },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="block text-xs text-text-muted uppercase tracking-widest mb-1">{label}</label>
                <textarea
                  value={value}
                  onChange={e => set(e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className={cn(
                    'w-full bg-panel border border-border rounded-lg px-4 py-3 text-sm text-text-primary resize-none',
                    'placeholder:text-text-muted outline-none focus:border-orange focus:shadow-orange transition-all'
                  )}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-text-muted uppercase tracking-widest mb-1">Attachments</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {files.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-panel border border-border rounded-full text-xs text-text-muted">
                    📎 {f.name}
                    <button type="button" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="ml-1 hover:text-orange">×</button>
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-text-muted hover:text-orange transition-colors">
                + Add file
              </button>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
            </div>

            {error && <p className="text-xs text-orange border border-orange/30 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-text-muted border border-border rounded-lg hover:border-text-muted transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isPending} className="flex-1 py-2 text-sm font-semibold bg-orange text-black rounded-lg hover:brightness-110 disabled:opacity-50 transition-all">
                {isPending ? 'Saving…' : 'Add entry'}
              </button>
            </div>
          </form>
        )}

        {atLimit && (
          <button onClick={onClose} className="w-full py-2 text-sm text-text-muted border border-border rounded-lg">Close</button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/entries/
git commit -m "feat: add entry card and add-entry modal"
```

---

## Task 15: Entries Feed & Right Panel

**Files:**
- Create: `components/entries/entries-feed.tsx`, `components/detail/right-panel.tsx`

- [ ] **Step 1: Create EntriesFeed**

Create `components/entries/entries-feed.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns'
import { EntryCard } from './entry-card'
import { AddEntryModal } from './add-entry-modal'
import { getCurrentMonday } from '@/lib/utils/week'
import type { Entry } from '@/types'

export function EntriesFeed({ projectId, entries }: { projectId: string; entries: Entry[] }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)

  const monthEntries = entries.filter(e =>
    isWithinInterval(parseISO(e.week_start), { start: monthStart, end: monthEnd })
  )

  const currentMonday = getCurrentMonday()
  const weeklyCount = entries.filter(e => e.week_start === currentMonday).length

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  function nextMonth() {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
    if (next <= new Date()) setViewDate(next)
  }

  const isCurrentMonth =
    viewDate.getMonth() === new Date().getMonth() &&
    viewDate.getFullYear() === new Date().getFullYear()

  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="text-text-muted hover:text-text-primary transition-colors px-2">‹</button>
          <span className="text-sm font-semibold text-text-primary w-32 text-center">
            {format(viewDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="text-text-muted hover:text-text-primary transition-colors px-2 disabled:opacity-30"
          >
            ›
          </button>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={weeklyCount >= 2 && isCurrentMonth}
          title={weeklyCount >= 2 ? 'Max 2 entries per week' : 'Add entry'}
          className="px-4 py-2 text-xs font-semibold bg-orange text-black rounded-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          + Add entry
        </button>
      </div>

      {/* Entries */}
      {monthEntries.length === 0 ? (
        <p className="text-sm text-text-muted py-8 text-center">No entries for {format(viewDate, 'MMMM yyyy')}.</p>
      ) : (
        <div className="space-y-4">
          {[...monthEntries].reverse().map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <AddEntryModal
        projectId={projectId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        weeklyCount={weeklyCount}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create RightPanel**

Create `components/detail/right-panel.tsx`:

```tsx
import { EntriesFeed } from '@/components/entries/entries-feed'
import type { Entry } from '@/types'

export function RightPanel({ projectId, entries }: { projectId: string; entries: Entry[] }) {
  return (
    <div className="flex-1 min-w-0 bg-panel border border-border rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-4">Entries</h2>
      <EntriesFeed projectId={projectId} entries={entries} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/entries/entries-feed.tsx components/detail/right-panel.tsx
git commit -m "feat: add entries feed with monthly pagination and right panel"
```

---

## Task 16: Project Detail Page with Realtime

**Files:**
- Create: `app/(app)/projects/[id]/page.tsx`, `components/detail/realtime-entries.tsx`

- [ ] **Step 1: Create Realtime entries subscriber**

Create `components/detail/realtime-entries.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RightPanel } from './right-panel'
import type { Entry } from '@/types'

export function RealtimeEntries({ projectId, initialEntries }: { projectId: string; initialEntries: Entry[] }) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`entries:${projectId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'entries', filter: `project_id=eq.${projectId}` },
        payload => {
          setEntries(prev => [...prev, payload.new as Entry])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [projectId])

  return <RightPanel projectId={projectId} entries={entries} />
}
```

- [ ] **Step 2: Create Project detail page**

Create `app/(app)/projects/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LeftPanel } from '@/components/detail/left-panel'
import { RealtimeEntries } from '@/components/detail/realtime-entries'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: project } = await supabase
    .from('projects')
    .select('*, project_members(user_id, profiles(id, display_name, avatar_url))')
    .eq('id', params.id)
    .single()

  if (!project) notFound()

  const { data: entries } = await supabase
    .from('entries')
    .select('*, entry_attachments(*), profiles(id, display_name)')
    .eq('project_id', params.id)
    .order('created_at', { ascending: true })

  const isCreator = project.created_by === user?.id

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6 items-start">
      <LeftPanel project={project} isCreator={isCreator} />
      <RealtimeEntries projectId={project.id} initialEntries={entries ?? []} />
    </div>
  )
}
```

- [ ] **Step 3: Verify project detail renders**

```bash
npm run dev
```

Create a project from the dashboard → click the card → project detail page should show the left panel and empty entries feed.

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/projects/ components/detail/realtime-entries.tsx
git commit -m "feat: add project detail page with Realtime entry subscription"
```

---

## Task 17: Invite Landing Page

**Files:**
- Create: `app/invite/[token]/page.tsx`

- [ ] **Step 1: Create invite landing page**

Create `app/invite/[token]/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { joinViaToken } from '@/lib/actions/members'

export default async function InvitePage({ params }: { params: { token: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Store the invite token in the redirect URL so we can pick it up post-auth
    redirect(`/?invite=${params.token}`)
  }

  const result = await joinViaToken(params.token)

  if (result.error) {
    return (
      <main className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-text-primary">Realign</h1>
          <p className="text-sm text-text-muted">{result.error}</p>
          <a href="/dashboard" className="inline-block mt-4 px-6 py-2 bg-orange text-black text-sm font-semibold rounded-lg">
            Go to dashboard
          </a>
        </div>
      </main>
    )
  }

  redirect(`/projects/${result.data.projectId}`)
}
```

- [ ] **Step 2: Handle post-auth invite redirect in auth page**

Update `app/page.tsx` to pass invite param through to the redirect:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthForm } from '@/components/auth/auth-form'

export default async function AuthPage({
  searchParams,
}: {
  searchParams: { invite?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    if (searchParams.invite) redirect(`/invite/${searchParams.invite}`)
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-page flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tight text-text-primary">Realign</h1>
          <p className="mt-2 text-sm text-text-muted">Track what shipped, what slipped, what&apos;s blocking.</p>
        </div>
        <AuthForm redirectTo={searchParams.invite ? `/invite/${searchParams.invite}` : '/dashboard'} />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Update AuthForm to accept redirectTo prop**

Update `components/auth/auth-form.tsx` — change the `signInWithOtp` call:

```tsx
export function AuthForm({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  // ... existing state ...

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}${redirectTo}` },
    })
    // ... rest unchanged ...
  }
  // ... rest unchanged ...
}
```

- [ ] **Step 4: Commit**

```bash
git add app/invite/ app/page.tsx components/auth/auth-form.tsx
git commit -m "feat: add invite landing page and post-auth invite redirect"
```

---

## Task 18: Toast Notification Component

**Files:**
- Create: `components/ui/toast.tsx`

- [ ] **Step 1: Create Toast context + component**

Create `components/ui/toast.tsx`:

```tsx
'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface Toast { id: number; message: string; type: 'error' | 'success' }

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'error') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              'px-4 py-3 rounded-xl text-sm font-medium border backdrop-blur-sm',
              'bg-surface/90 text-text-primary',
              toast.type === 'error' ? 'border-orange shadow-orange' : 'border-green-600'
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
```

- [ ] **Step 2: Add ToastProvider to app shell**

Update `app/(app)/layout.tsx` to wrap children with ToastProvider:

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HoneycombBg } from '@/components/ui/honeycomb-bg'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { ToastProvider } from '@/components/ui/toast'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen relative">
      <HoneycombBg />
      <nav className="border-b border-border bg-page/80 backdrop-blur-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-black tracking-tight text-text-primary">Realign</span>
        <SignOutButton />
      </nav>
      <main className="relative z-10">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/toast.tsx app/\(app\)/layout.tsx
git commit -m "feat: add toast notification system"
```

---

## Task 19: Deployment Configuration

**Files:**
- Create: `docs/deployment.md` (instructions only, no code)

- [ ] **Step 1: Set Vercel environment variables**

In Vercel project settings → Environment Variables, add:
```
NEXT_PUBLIC_SUPABASE_URL        = (from Supabase project settings)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (from Supabase project settings)
SUPABASE_SERVICE_ROLE_KEY       = (from Supabase project settings)
RESEND_API_KEY                  = (from resend.com dashboard)
NEXT_PUBLIC_APP_URL             = https://your-vercel-domain.vercel.app
```

- [ ] **Step 2: Update Resend sender domain**

In `app/api/invite/route.ts`, replace `noreply@yourdomain.com` with your verified Resend sender address. If using Resend's shared domain during development, use `onboarding@resend.dev`.

- [ ] **Step 3: Add Supabase redirect URL**

In Supabase dashboard → Authentication → URL Configuration → Redirect URLs, add:
```
https://your-vercel-domain.vercel.app/**
http://localhost:3000/**
```

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: no TypeScript errors, no build failures.

- [ ] **Step 6: Push and deploy**

```bash
git add -A
git commit -m "chore: deployment configuration"
git push origin main
```

Vercel auto-deploys on push. Verify the deployed URL loads the sign-in page.

---

## Self-Review

**Spec coverage check:**
- ✅ Multi-user auth — Task 6, 7
- ✅ 3-column project grid, scrollable — Task 12
- ✅ Cover image upload per project — Task 11, 13
- ✅ Project name bottom-left, progress bottom-right on card — Task 11
- ✅ Honeycomb canvas, dark gray, futuristic — Task 7
- ✅ Cards darkened unless 100% — Task 11
- ✅ Replace/remove cover image — Task 13
- ✅ Entry fields: shipped, slipped, blocking + attachments — Task 14
- ✅ Max 2 entries per week — Task 9
- ✅ Monthly pagination — Task 15
- ✅ Bento entry card design — Task 14
- ✅ Collaborative (shared projects) — Task 10
- ✅ Creator-only delete — Task 8, 13
- ✅ Email invite + shareable link — Task 10, 17
- ✅ Neon orange highlights, gray/black palette — Task 1 (Tailwind config)
- ✅ Supabase Realtime for live updates — Task 16
- ✅ RLS policies — Task 3
