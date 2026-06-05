# Realign — Design Spec

**Date:** 2026-06-05
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel
**Location:** `C:\Users\Admin\Desktop\Personal Projects\pm-project-mgmt`

---

## Overview

Realign is a collaborative project management app. Users create projects, invite teammates, and log weekly entries capturing what shipped, what slipped, and what's blocking progress. The main view presents projects as image-backed cards on a futuristic honeycomb canvas. Each project tracks a manually-set progress percentage and displays dated entries paginated by month.

---

## Architecture

**Pattern:** Next.js App Router with Server Components + Supabase SSR + Supabase Realtime

- Server components handle initial data fetches via the Supabase server client — no loading flicker on first paint
- Client components subscribe to Supabase Realtime channels scoped per `project_id` — collaborator updates (entries, progress changes) appear live without refresh
- Mutations use Next.js Server Actions — no separate API routes
- Supabase Auth handles sessions via cookies (SSR-safe)
- `middleware.ts` protects all `/dashboard` and `/projects/*` routes; unauthenticated requests redirect to `/`

---

## Data Model

### `profiles`
Extends Supabase Auth users.
| Column | Type | Notes |
|---|---|---|
| id | uuid | FK → auth.users |
| display_name | text | |
| avatar_url | text | |

### `projects`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | text | |
| created_by | uuid | FK → profiles |
| progress | int | 0–100, manually set |
| cover_url | text | Supabase Storage path |
| invite_token | uuid | for shareable link |
| created_at | timestamptz | |

### `project_members`
| Column | Type | Notes |
|---|---|---|
| project_id | uuid | FK → projects |
| user_id | uuid | FK → profiles |
| joined_at | timestamptz | |

### `entries`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | FK → projects |
| author_id | uuid | FK → profiles |
| week_start | date | Monday of the entry's week |
| what_shipped | text | |
| what_slipped | text | |
| whats_blocking | text | |
| created_at | timestamptz | |

**Constraint:** Max 2 entries per `(project_id, week_start)` — enforced server-side in the Server Action before DB write.

### `entry_attachments`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| entry_id | uuid | FK → entries |
| file_url | text | Supabase Storage path |
| file_name | text | |
| uploaded_by | uuid | FK → profiles |
| created_at | timestamptz | |

### `project_invites`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | FK → projects |
| invited_email | text | |
| token | uuid | unique invite token |
| accepted_at | timestamptz | null until accepted |
| created_at | timestamptz | |

### Row-Level Security
- All project data (members, entries, attachments) is readable and writable only by `project_members`
- `DELETE` on `projects` restricted to `created_by = auth.uid()`
- Invite tokens on `project_invites` are readable without auth (to allow join flow)

---

## Pages & Routing

### `/` — Auth
- Supabase Auth UI: email/password + magic link
- Redirects to `/dashboard` on sign-in

### `/dashboard` — Main Canvas
- Honeycomb-patterned full-viewport canvas
- Projects in a 3-column CSS grid, vertically scrollable
- "New Project" card (dashed border, `+` icon) always first
- Each project card:
  - Cover image as `object-cover` fill (aspect ratio `4:3`)
  - Dark overlay (`bg-black/60`) unless progress = 100% (overlay lifted, neon orange ring added)
  - Project name — bottom left, white `font-semibold text-sm`
  - Progress % — bottom right, neon orange `font-bold`
  - Click → `/projects/[id]`

### `/projects/[id]` — Project Detail
Bento-style two-zone layout:

**Left panel — Project Meta**
- Project name
- Cover image with Replace / Remove controls (uploads to Supabase Storage; old file deleted on replace)
- Progress input: editable number field (0–100), neon orange
- Collaborators list (avatars + display names)
- Invite controls: email input field + "Copy Link" button (copies `/invite/[invite_token]`)

**Right panel — Entries Feed**
- Month pagination: prev / next month controls at top
- Entries in reverse chronological order, one bento card per entry
- Each entry card (bento cells):
  - Week range header (muted)
  - `What Shipped` cell
  - `What Slipped & Why` cell
  - `What's Blocking` cell
  - Attachments: pill chips with file icon + name
- "Add Entry" button — disabled with tooltip if 2 entries already exist for the current week

### `/invite/[token]` — Join via Link
- Public route (no auth required to land)
- Shows project name
- Prompts sign-in if not authenticated
- On auth: checks token against `project_invites` (email invite) or `projects.invite_token` (shareable link)
- Inserts into `project_members`, redirects to `/projects/[id]`

---

## File Storage

| Bucket | Path | Access | Notes |
|---|---|---|---|
| `covers` | `covers/{project_id}/{filename}` | Public read, auth write | Old file deleted on replace |
| `attachments` | `attachments/{entry_id}/{filename}` | Private, signed URLs (1hr expiry) | |

---

## Invite System

**Email invite:**
1. Creator types email in the left panel invite field
2. Server Action inserts into `project_invites` with a unique token
3. Email sent via Resend SDK in a Next.js API route (`/api/invite`) with link to `/invite/[token]`
4. Recipient lands on invite page → signs in → `accepted_at` stamped → added to `project_members`

**Shareable link:**
1. Creator clicks "Copy Link" — copies `/invite/[projects.invite_token]`
2. Anyone with the link follows the same join flow, matching against `projects.invite_token`

---

## Entry Validation

Server Action checks before any DB write:
```ts
const count = await supabase
  .from('entries')
  .select('id', { count: 'exact' })
  .eq('project_id', projectId)
  .eq('week_start', currentMonday)

if (count >= 2) return { error: 'Maximum 2 entries per week reached.' }
```

`currentMonday` computed as the ISO Monday of the current week.

---

## Visual Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| Page bg | `#111111` | Page base |
| Canvas bg | `#1a1a1a` | Authenticated canvas |
| Surface | `#1e1e1e` | Cards |
| Panel | `#252525` | Side panels |
| Border | `#2e2e2e` | Dividers |
| Text primary | `#f0f0f0` | Body |
| Text muted | `#6b6b6b` | Timestamps, labels |
| Neon orange | `#ff6b00` | Progress %, CTAs, accents |
| Neon glow | `box-shadow: 0 0 8px #ff6b00` | Focused inputs, key highlights |

### Background
SVG honeycomb pattern tiled via `background-repeat` on all authenticated pages. Dark gray base (`#1a1a1a`) with slightly lighter hex cells (`#222222`) at low opacity — textured without being distracting.

### Typography
- Font: `Inter` via `next/font`
- App wordmark "Realign": `font-black tracking-tight`, white, no color accent

### Project Cards
- Aspect ratio `4:3`, `rounded-2xl`
- `object-cover` fill
- Overlay: `bg-black/60` (removed at 100% progress; neon orange ring added instead)
- Name: bottom-left, `font-semibold text-sm`, white with text-shadow
- Progress: bottom-right, `font-bold text-base`, neon orange

### Entry Cards (Bento)
- Three bento cells per card: `What Shipped` / `What Slipped & Why` / `What's Blocking`
- Cells separated by `border-[#2e2e2e]`
- Attachments: pill chips (`bg-[#252525] border border-[#2e2e2e]`) with file icon
- Week range: muted header at top of card

---

## Error Handling

- Server Action results typed as `{ error: string } | { data: T }` — errors never thrown to the client
- RLS violations return `null` data — treated as not-found, redirect to `/dashboard`
- Upload failures: inline toast (neon orange border, dark background, auto-dismiss)
- Entry limit: "Add Entry" button disabled + tooltip; also validated server-side

---

## Out of Scope

- Project archiving or soft-delete (creator hard-deletes only)
- Entry editing after creation
- Notifications / activity feed
- Mobile-specific layout (responsive but desktop-first)
