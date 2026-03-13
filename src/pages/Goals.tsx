import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { todayISO } from '../lib/format'
import GoldStarCard from '../components/GoldStarCard'
import GoldStarModal from '../components/GoldStarModal'
import Toast from '../components/Toast'
import DayNav from '../components/DayNav'
import type { GoldStar } from '../types'

function generateId(): string {
  return `gs_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export default function Goals() {
  const [goldStars, setGoldStars] = useState<GoldStar[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<GoldStar | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const isToday = selectedDate === todayISO()

  const loadData = useCallback(async () => {
    try {
      const { goldStars: data } = await api.getGoldStars()
      setGoldStars(data.sort((a, b) => a.order - b.order))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function save(updated: GoldStar[]) {
    setSaving(true)
    try {
      await api.updateGoldStars({ goldStars: updated })
      setGoldStars(updated)
    } catch {
      setToast('Error saving goals')
    } finally {
      setSaving(false)
    }
  }

  function handleAddOpen() {
    setEditingGoal(null)
    setModalOpen(true)
  }

  function handleEditOpen(goal: GoldStar) {
    setEditingGoal(goal)
    setModalOpen(true)
  }

  async function handleModalSave(caption: string, notes: string) {
    setModalOpen(false)
    const dateTs = isToday ? new Date().toISOString() : `${selectedDate}T12:00:00.000Z`
    if (editingGoal) {
      const updated = goldStars.map(gs =>
        gs.id === editingGoal.id ? { ...gs, caption, notes } : gs
      )
      await save(updated)
      setToast('Goal updated')
    } else {
      const newGoal: GoldStar = {
        id: generateId(),
        caption,
        notes,
        created_at: dateTs,
        order: goldStars.length + 1,
      }
      const updated = [...goldStars, newGoal]
      await save(updated)
      setToast('Goal added ⭐')
    }
  }

  async function handleComplete(goal: GoldStar) {
    const completedTs = isToday ? new Date().toISOString() : `${selectedDate}T12:00:00.000Z`
    const updated = goldStars.map(gs =>
      gs.id === goal.id ? { ...gs, completed_at: completedTs } : gs
    )
    await save(updated)
    setToast(`Gold star! ${goal.caption} ⭐`)
  }

  const activeGoals = goldStars.filter(gs => !gs.completed_at)
  const completedGoals = goldStars.filter(gs => gs.completed_at)
    .sort((a, b) => (b.completed_at ?? '').localeCompare(a.completed_at ?? ''))

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <header className="bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Goals ⭐</h1>
            <button
              className="text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 px-3 py-1.5 rounded-lg"
              onClick={handleAddOpen}
              disabled={saving}
            >
              + Add goal
            </button>
          </div>
          <DayNav date={selectedDate} onChange={setSelectedDate} />
        </div>
      </header>

      <main className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            {!isToday && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
                Completing or adding goals will use the selected date.
              </div>
            )}
            {activeGoals.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">⭐</p>
                <p className="text-gray-500 text-sm font-medium">No active goals</p>
                <p className="text-gray-400 text-xs mt-1">Add a domestic goal to work towards</p>
                <button
                  className="mt-4 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl"
                  onClick={handleAddOpen}
                >
                  Add your first goal
                </button>
              </div>
            ) : (
              <section className="mb-6">
                <div className="flex flex-col gap-3">
                  {activeGoals.map(goal => (
                    <GoldStarCard
                      key={goal.id}
                      goldStar={goal}
                      onComplete={handleComplete}
                      onEdit={handleEditOpen}
                      disabled={saving}
                    />
                  ))}
                </div>
              </section>
            )}

            {completedGoals.length > 0 && (
              <section className="mt-2">
                <button
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 w-full text-left"
                  onClick={() => setShowCompleted(v => !v)}
                >
                  <span>Completed ({completedGoals.length})</span>
                  <span className="text-xs">{showCompleted ? '▲' : '▼'}</span>
                </button>
                {showCompleted && (
                  <div className="flex flex-col gap-3">
                    {completedGoals.map(goal => (
                      <GoldStarCard
                        key={goal.id}
                        goldStar={goal}
                        onComplete={handleComplete}
                        onEdit={handleEditOpen}
                        disabled={saving}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <GoldStarModal
          goldStar={editingGoal}
          onSave={handleModalSave}
          onCancel={() => setModalOpen(false)}
        />
      )}
      <Toast message={toast} onDismiss={() => setToast('')} />
    </div>
  )
}
