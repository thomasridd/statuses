import { useState } from 'react'
import type { GoldStar } from '../types'

interface GoldStarCardProps {
  goldStar: GoldStar
  onComplete: (goldStar: GoldStar) => void
  onEdit: (goldStar: GoldStar) => void
  disabled?: boolean
}

export default function GoldStarCard({ goldStar, onComplete, onEdit, disabled }: GoldStarCardProps) {
  const [notesExpanded, setNotesExpanded] = useState(false)
  const isCompleted = !!goldStar.completed_at

  return (
    <div className={`rounded-xl border shadow-sm bg-white overflow-hidden ${isCompleted ? 'border-amber-200 opacity-60' : 'border-amber-300'}`}>
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="text-xl shrink-0 mt-0.5">{isCompleted ? '✅' : '⭐'}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {goldStar.caption}
          </p>
          {goldStar.notes && (
            <div className="mt-1">
              <p
                className={`text-xs text-gray-500 leading-relaxed ${notesExpanded ? '' : 'line-clamp-2'}`}
              >
                {goldStar.notes}
              </p>
              {goldStar.notes.length > 80 && (
                <button
                  className="text-xs text-sky-500 mt-0.5"
                  onClick={() => setNotesExpanded(e => !e)}
                >
                  {notesExpanded ? 'Less' : 'More'}
                </button>
              )}
            </div>
          )}
        </div>
        {!isCompleted && (
          <button
            className="shrink-0 text-gray-400 hover:text-gray-600 p-1"
            onClick={() => onEdit(goldStar)}
            disabled={disabled}
            aria-label="Edit goal"
          >
            ✏️
          </button>
        )}
      </div>
      {!isCompleted && (
        <div className="border-t border-amber-100 px-4 py-2 flex justify-end">
          <button
            className="text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 disabled:opacity-50 px-3 py-1.5 rounded-lg"
            onClick={() => onComplete(goldStar)}
            disabled={disabled}
          >
            Done ✓
          </button>
        </div>
      )}
    </div>
  )
}
