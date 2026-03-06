export default function StatusCard({ status, onLog, onLogCustom, disabled }) {
  const isValue = status.type === 'value'
  const label = isValue
    ? `${status.label} ${status.default_value}${status.unit}`
    : status.label

  return (
    <div className="flex rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
      <button
        className="flex-1 px-3 py-3 text-left text-sm font-medium text-gray-800 leading-snug active:bg-gray-50 disabled:opacity-50"
        onClick={() => onLog(status)}
        disabled={disabled}
      >
        {label}
      </button>
      {isValue && (
        <button
          className="px-3 border-l border-gray-200 text-gray-400 hover:text-gray-700 active:bg-gray-50 text-lg disabled:opacity-50"
          onClick={() => onLogCustom(status)}
          disabled={disabled}
          title="Log custom value"
        >
          ✎
        </button>
      )}
    </div>
  )
}
