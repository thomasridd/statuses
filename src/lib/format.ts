import type { Status } from '../types'

const CURRENCY_SYMBOLS = new Set(['£', '$', '€', '¥'])

export function isCurrencyUnit(unit: string | null): boolean {
  return unit !== null && CURRENCY_SYMBOLS.has(unit)
}

export function formatValueWithUnit(value: number | null | undefined, unit: string | null): string {
  if (value === null || value === undefined) return ''
  if (isCurrencyUnit(unit)) return `${unit}${value}`
  return `${value}${unit ?? ''}`
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatStatusLabel(status: Status, value?: number | null): string {
  if (status.type === 'value') {
    const v = value !== undefined && value !== null ? value : status.default_value
    return `${status.label} ${formatValueWithUnit(v, status.unit)}`
  }
  return status.label
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
