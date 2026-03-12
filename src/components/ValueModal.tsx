import { useState, useEffect } from 'react'
import type { Status } from '../types'
import { isCurrencyUnit } from '../lib/format'

interface ValueModalProps {
  status: Status | null
  onConfirm: (value: number) => void
  onCancel: () => void
}

export default function ValueModal({ status, onConfirm, onCancel }: ValueModalProps) {
  const [value, setValue] = useState<number | string>(status?.default_value ?? 0)

  useEffect(() => {
    setValue(status?.default_value ?? 0)
  }, [status])

  if (!status) return null

  const isCurrency = isCurrencyUnit(status.unit)
  const step = isCurrency ? 1 : (status.default_value || 1)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onCancel}>
      <div
        className="bg-white w-full max-w-md rounded-t-2xl p-6 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{status.label}</h2>
        <p className="text-sm text-gray-500 mb-4">Enter a custom value</p>

        <div className="flex items-center gap-3 mb-6">
          <button
            className="w-10 h-10 rounded-full bg-gray-100 text-xl font-bold text-gray-700 flex items-center justify-center"
            onClick={() => setValue(v => Math.max(0, Number(v) - step))}
          >−</button>
          <div className="flex-1 relative flex items-center">
            {isCurrency && (
              <span className="absolute left-3 text-2xl font-bold text-gray-500 pointer-events-none">{status.unit}</span>
            )}
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              className={`w-full text-center text-3xl font-bold text-gray-900 border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${isCurrency ? 'pl-7' : ''}`}
              min="0"
            />
          </div>
          <button
            className="w-10 h-10 rounded-full bg-gray-100 text-xl font-bold text-gray-700 flex items-center justify-center"
            onClick={() => setValue(v => Number(v) + step)}
          >+</button>
        </div>
        {!isCurrency && <p className="text-center text-sm text-gray-400 mb-4">Unit: {status.unit}</p>}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(Number(value))}
            className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-semibold"
          >
            Log it
          </button>
        </div>
      </div>
    </div>
  )
}
