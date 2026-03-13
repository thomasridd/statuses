interface DayNavProps {
  date: string // YYYY-MM-DD
  onChange: (date: string) => void
}

function formatDisplayDate(dateStr: string, today: string): string {
  if (dateStr === today) return 'Today'
  const d = new Date(dateStr + 'T12:00:00')
  const yesterday = new Date(today + 'T12:00:00')
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateStr === yesterday.toISOString().slice(0, 10)) return 'Yesterday'
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function DayNav({ date, onChange }: DayNavProps) {
  const today = new Date().toISOString().slice(0, 10)
  const isToday = date === today

  function shift(days: number) {
    const d = new Date(date + 'T12:00:00')
    d.setDate(d.getDate() + days)
    onChange(d.toISOString().slice(0, 10))
  }

  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={() => shift(-1)}
        className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 text-sm"
      >
        ‹ Prev
      </button>
      <button
        onClick={() => onChange(today)}
        className="flex-1 text-center text-sm font-medium text-sky-600 py-1.5"
      >
        {formatDisplayDate(date, today)}
      </button>
      <button
        onClick={() => shift(1)}
        disabled={isToday}
        className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 text-sm"
      >
        Next ›
      </button>
    </div>
  )
}
