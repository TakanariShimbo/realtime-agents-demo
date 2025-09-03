export type Status = 'disconnected' | 'connecting' | 'connected'

export default function StatusDot({ status }: { status: Status }) {
  const cls = status === 'connected' ? 'dot ok' : status === 'connecting' ? 'dot warn' : 'dot'
  return (
    <div className="status">
      <span className={cls} />
      <span>Session: {status}</span>
    </div>
  )
}

