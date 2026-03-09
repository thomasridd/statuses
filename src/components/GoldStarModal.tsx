import { useState, useEffect } from 'react'
import type { GoldStar } from '../types'

interface GoldStarModalProps {
  goldStar: GoldStar | null   // null = add mode, non-null = edit mode
  onSave: (caption: string, notes: string) => void
  onCancel: () => void
}

export default function GoldStarModal({ goldStar, onSave, onCancel }: GoldStarModalProps) {
  const [caption, setCaption] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (goldStar) {
      setCaption(goldStar.caption)
      setNotes(goldStar.notes)
    } else {
      setCaption('')
      setNotes('')
    }
  }, [goldStar])

  const isEdit = goldStar !== null
  const canSave = caption.trim().length > 0

  function handleSave() {
    if (!canSave) return
    onSave(caption.trim(), notes.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center sm:items-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl mb-[4.5rem] sm:mb-0">
        <div className="px-5 pt-5 pb-2 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit goal' : 'New goal'} ⭐
          </h2>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Goal caption <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tidy the loft"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="Add details, steps, or context…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-40"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isEdit ? 'Save changes' : 'Add goal'}
          </button>
        </div>
      </div>
    </div>
  )
}
