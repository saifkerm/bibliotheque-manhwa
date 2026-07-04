export default function TabBar({ screen, onLibrary, onAdd }) {
  const active = screen === 'library';
  return (
    <div
      style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, height: 82,
        background: 'linear-gradient(180deg, rgba(10,9,16,.4), #0d0b13 55%)',
        backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '0 20px 18px', zIndex: 20,
      }}
    >
      <div onClick={onLibrary} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
        <span style={{ fontSize: 21, filter: active ? 'none' : 'grayscale(1) opacity(.6)' }}>📚</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: active ? 'var(--acc)' : '#6b6878' }}>Biblio</span>
      </div>
      <div onClick={onAdd} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', marginTop: -22 }}>
        <span
          style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--acc),var(--acc2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: '#03251f', fontWeight: 800,
            boxShadow: '0 10px 24px -6px rgba(34,193,166,.6)',
          }}
        >
          ＋
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', opacity: .5 }}>
        <span style={{ fontSize: 21 }}>📊</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#6b6878' }}>Stats</span>
      </div>
    </div>
  );
}
