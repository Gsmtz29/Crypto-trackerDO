import { useState, useEffect } from 'react';

const COINS = [
  { id: 'bitcoin',   label: 'Bitcoin',   symbol: 'BTC', icon: '₿' },
  { id: 'ethereum',  label: 'Ethereum',  symbol: 'ETH', icon: 'Ξ' },
  { id: 'solana',    label: 'Solana',    symbol: 'SOL', icon: '◎' },
  { id: 'dogecoin',  label: 'Dogecoin',  symbol: 'DOGE', icon: 'Ð' },
  { id: 'ripple',    label: 'XRP',       symbol: 'XRP', icon: '✕' },
  { id: 'cardano',   label: 'Cardano',   symbol: 'ADA', icon: '₳' },
];

const styles = {
  root: {
    fontFamily: "'Inter', sans-serif",
    background: '#0a0a0f',
    minHeight: '100vh',
    color: '#e8e8f0',
    padding: '0',
    margin: '0',
  },
  header: {
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 100%)',
    borderBottom: '1px solid #2a2a40',
    padding: '24px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '22px',
    fontWeight: '700',
    color: '#c084fc',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#6b6b8a',
    fontFamily: "'Space Mono', monospace",
    margin: 0,
  },
  main: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  card: {
    background: '#12121f',
    border: '1px solid #2a2a40',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '24px',
  },
  label: {
    fontSize: '11px',
    fontFamily: "'Space Mono', monospace",
    color: '#6b6b8a',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
    display: 'block',
  },
  coinGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '10px',
    marginBottom: '20px',
  },
  coinBtn: (selected) => ({
    background: selected ? '#1e1040' : '#0f0f1a',
    border: `1px solid ${selected ? '#c084fc' : '#2a2a40'}`,
    borderRadius: '10px',
    padding: '12px',
    cursor: 'pointer',
    color: selected ? '#c084fc' : '#9090b0',
    fontFamily: "'Space Mono', monospace",
    fontSize: '13px',
    textAlign: 'center',
    transition: 'all 0.15s ease',
  }),
  queryBtn: (disabled) => ({
    background: disabled ? '#2a2a40' : 'linear-gradient(135deg, #7c3aed, #c084fc)',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    color: disabled ? '#6b6b8a' : '#fff',
    fontFamily: "'Space Mono', monospace",
    fontSize: '14px',
    fontWeight: '700',
    cursor: disabled ? 'not-allowed' : 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.15s ease',
    width: '100%',
  }),
  resultCard: {
    background: 'linear-gradient(135deg, #0f0f2a, #1a0f3a)',
    border: '1px solid #7c3aed',
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '24px',
  },
  priceLabel: {
    fontSize: '12px',
    color: '#6b6b8a',
    fontFamily: "'Space Mono', monospace",
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  priceValue: {
    fontSize: '32px',
    fontFamily: "'Space Mono', monospace",
    fontWeight: '700',
    color: '#c084fc',
  },
  priceMxn: {
    fontSize: '18px',
    fontFamily: "'Space Mono', monospace",
    color: '#9090b0',
    marginTop: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "'Space Mono', monospace",
    fontSize: '13px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#6b6b8a',
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    borderBottom: '1px solid #2a2a40',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #1a1a2e',
    color: '#c8c8e0',
  },
  error: {
    background: '#1f0a0a',
    border: '1px solid #7f1d1d',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#f87171',
    fontFamily: "'Space Mono', monospace",
    fontSize: '13px',
    marginBottom: '16px',
  },
  badge: {
    display: 'inline-block',
    background: '#1e1040',
    color: '#c084fc',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '11px',
    fontFamily: "'Space Mono', monospace",
  },
};

export default function App() {
  const [selected, setSelected]   = useState('');
  const [result,   setResult]     = useState(null);
  const [history,  setHistory]    = useState([]);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState('');

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const res  = await fetch('/api/crypto/history/all');
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch (_) {}
  }

  async function handleQuery() {
    if (!selected || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res  = await fetch(`/api/crypto/${selected}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      fetchHistory();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const coin = COINS.find(c => c.id === selected);

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>◈ CRYPTO TRACKER</h1>
          <p style={styles.subtitle}>Precios en tiempo real · Historial en DB</p>
        </div>
      </header>

      <main style={styles.main}>
        {/* Selector */}
        <div style={styles.card}>
          <span style={styles.label}>Selecciona una criptomoneda</span>
          <div style={styles.coinGrid}>
            {COINS.map(c => (
              <button
                key={c.id}
                style={styles.coinBtn(selected === c.id)}
                onClick={() => setSelected(c.id)}
              >
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{c.icon}</div>
                <div style={{ fontWeight: '700' }}>{c.symbol}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>{c.label}</div>
              </button>
            ))}
          </div>
          <button
            style={styles.queryBtn(!selected || loading)}
            onClick={handleQuery}
            disabled={!selected || loading}
          >
            {loading ? '⟳  CONSULTANDO...' : '→  CONSULTAR PRECIO'}
          </button>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>⚠ {error}</div>}

        {/* Resultado */}
        {result && coin && (
          <div style={styles.resultCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '36px' }}>{coin.icon}</span>
              <div>
                <div style={{ fontSize: '20px', fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#e8e8f0' }}>
                  {coin.label}
                </div>
                <span style={styles.badge}>{coin.symbol}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={styles.priceLabel}>PRECIO USD</p>
                <p style={styles.priceValue}>${Number(result.price_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p style={styles.priceLabel}>PRECIO MXN</p>
                <p style={{ ...styles.priceValue, color: '#60d394' }}>${Number(result.price_mxn).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        )}

        {/* Historial */}
        <div style={styles.card}>
          <span style={styles.label}>Historial de consultas</span>
          {history.length === 0 ? (
            <p style={{ color: '#6b6b8a', fontFamily: "'Space Mono', monospace", fontSize: '13px' }}>
              Sin consultas aún. Haz tu primera consulta arriba.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Moneda</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>USD</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>MXN</th>
                    <th style={styles.th}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(row => (
                    <tr key={row.id}>
                      <td style={{ ...styles.td, color: '#6b6b8a' }}>{row.id}</td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{row.symbol.toUpperCase()}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', color: '#c084fc' }}>
                        ${Number(row.price_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', color: '#60d394' }}>
                        ${Number(row.price_mxn).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ ...styles.td, fontSize: '11px', color: '#6b6b8a' }}>
                        {new Date(row.queried_at).toLocaleString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
