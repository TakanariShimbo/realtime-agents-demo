export default function ConnectionControls(props: {
  connected: boolean
  muted: boolean
  onDisconnect: () => void
  onToggleMute: () => void
}) {
  return (
    <div className="mt8 controls">
      <button onClick={props.onDisconnect} disabled={!props.connected}>
        Disconnect
      </button>
      <button onClick={props.onToggleMute} disabled={!props.connected}>
        {props.muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  )
}

