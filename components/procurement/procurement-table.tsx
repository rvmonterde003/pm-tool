'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  createProcurementItem,
  deleteProcurementItem,
  updateProcurementItem,
  updateProcurementRemarks,
} from '@/lib/actions/procurement'
import { ModalPortal } from '@/components/ui/modal-portal'
import { cn } from '@/lib/utils/cn'
import type { ProcurementItem, ProcurementRemarks } from '@/types'

type SortMode = 'date' | 'alpha'

const REMARKS_OPTIONS: ProcurementRemarks[] = ['waiting', 'purchased', 'delivered']

const REMARKS_STYLES: Record<ProcurementRemarks, string> = {
  waiting: 'text-amber-400',
  purchased: 'text-sky-400',
  delivered: 'text-emerald-400',
}

function EditItemModal({
  item,
  open,
  onClose,
}: {
  item: ProcurementItem | null
  open: boolean
  onClose: () => void
}) {
  const [itemName, setItemName] = useState(item?.item_name ?? '')
  const [qty, setQty] = useState(item?.qty ?? 1)
  const [specification, setSpecification] = useState(item?.specification ?? '')
  const [usage, setUsage] = useState(item?.usage ?? '')
  const [sampleLink, setSampleLink] = useState(item?.sample_link ?? '')
  const [remarks, setRemarks] = useState<ProcurementRemarks>(item?.remarks ?? 'waiting')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const isNew = !item

  function resetForm() {
    setItemName(item?.item_name ?? '')
    setQty(item?.qty ?? 1)
    setSpecification(item?.specification ?? '')
    setUsage(item?.usage ?? '')
    setSampleLink(item?.sample_link ?? '')
    setRemarks(item?.remarks ?? 'waiting')
    setError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      if (isNew) {
        const result = await createProcurementItem({
          item_name: itemName,
          qty,
          specification,
          usage,
          sample_link: sampleLink || null,
        })
        if (result.error) {
          setError(result.error)
          return
        }
      } else {
        const result = await updateProcurementItem({
          id: item.id,
          item_name: itemName,
          qty,
          specification,
          usage,
          sample_link: sampleLink || null,
          remarks,
        })
        if (result.error) {
          setError(result.error)
          return
        }
      }
      onClose()
    })
  }

  if (!open) return null

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5 my-auto">
          <h2 className="text-lg font-semibold text-text-primary">
            {isNew ? 'Add item' : 'Edit item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Item name" value={itemName} onChange={setItemName} required />
            <Field label="Qty" value={String(qty)} onChange={v => setQty(Math.max(1, Number(v) || 1))} type="number" required />
            <Field label="Specification" value={specification} onChange={setSpecification} />
            <Field label="Usage" value={usage} onChange={setUsage} />
            <Field label="Sample link" value={sampleLink} onChange={setSampleLink} placeholder="https://..." />
            {!isNew && (
              <div>
                <label className="block text-xs text-text-muted mb-1 uppercase tracking-widest">Remarks</label>
                <select
                  value={remarks}
                  onChange={e => setRemarks(e.target.value as ProcurementRemarks)}
                  className="w-full bg-panel border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none focus:border-orange"
                >
                  {REMARKS_OPTIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { resetForm(); onClose() }}
                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-border text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-orange text-black hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isPending ? 'Saving…' : isNew ? 'Add item' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={cn(
          'w-full bg-panel border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary',
          'outline-none focus:border-orange focus:shadow-orange transition-all'
        )}
      />
    </div>
  )
}

export function ProcurementTable({ items }: { items: ProcurementItem[] }) {
  const [sort, setSort] = useState<SortMode>('date')
  const [hideDelivered, setHideDelivered] = useState(false)
  const [editItem, setEditItem] = useState<ProcurementItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const sorted = useMemo(() => {
    let list = [...items]
    if (hideDelivered) list = list.filter(i => i.remarks !== 'delivered')
    list.sort((a, b) => {
      if (sort === 'alpha') return a.item_name.localeCompare(b.item_name)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    return list
  }, [items, sort, hideDelivered])

  function openNew() {
    setEditItem(null)
    setModalOpen(true)
  }

  function openEdit(item: ProcurementItem) {
    setEditItem(item)
    setModalOpen(true)
  }

  function handleRemarksChange(id: string, remarks: ProcurementRemarks) {
    startTransition(async () => {
      await updateProcurementRemarks(id, remarks)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    startTransition(async () => {
      await deleteProcurementItem(id)
    })
  }

  return (
    <div className="px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortMode)}
            className="bg-panel border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary outline-none focus:border-orange"
          >
            <option value="date">Sort by date added</option>
            <option value="alpha">Sort alphabetically</option>
          </select>
          <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={hideDelivered}
              onChange={e => setHideDelivered(e.target.checked)}
              className="accent-orange"
            />
            Hide delivered
          </label>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange text-black hover:brightness-110 transition-all"
        >
          + Add item
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-panel/50 text-left">
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-text-muted font-medium">Item name</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-text-muted font-medium w-16">Qty</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-text-muted font-medium">Specification</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-text-muted font-medium">Usage</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-text-muted font-medium">Sample link</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-text-muted font-medium w-32">Remarks</th>
              <th className="px-4 py-3 text-xs uppercase tracking-widest text-text-muted font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted text-sm">
                  No items yet. Add your first procurement item.
                </td>
              </tr>
            ) : (
              sorted.map(item => (
                <tr key={item.id} className="border-b border-border/60 hover:bg-panel/30 transition-colors">
                  <td className="px-4 py-3 text-text-primary font-medium">{item.item_name}</td>
                  <td className="px-4 py-3 text-text-muted">{item.qty}</td>
                  <td className="px-4 py-3 text-text-muted max-w-[200px] truncate" title={item.specification}>{item.specification}</td>
                  <td className="px-4 py-3 text-text-muted max-w-[160px] truncate" title={item.usage}>{item.usage}</td>
                  <td className="px-4 py-3">
                    {item.sample_link ? (
                      <a
                        href={item.sample_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange hover:underline text-xs truncate block max-w-[140px]"
                      >
                        Link
                      </a>
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={item.remarks}
                      disabled={isPending}
                      onChange={e => handleRemarksChange(item.id, e.target.value as ProcurementRemarks)}
                      className={cn(
                        'bg-panel border border-border rounded-lg px-2 py-1 text-xs capitalize outline-none focus:border-orange w-full',
                        REMARKS_STYLES[item.remarks]
                      )}
                    >
                      {REMARKS_OPTIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-text-muted hover:text-orange hover:bg-panel transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-panel transition-colors disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditItemModal
        key={editItem?.id ?? 'new'}
        item={editItem}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
