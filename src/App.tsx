import { useEffect, useState } from 'react';

type HealthState =
  | { status: 'loading' }
  | { status: 'ok'; db: string }
  | { status: 'error'; message: string };

export function buildApiUrl(path: string, baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export function App() {
  const appName = import.meta.env.VITE_APP_NAME || 'liouni';
  const [health, setHealth] = useState<HealthState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    fetch(buildApiUrl('/api/health'))
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return (await res.json()) as { ok?: boolean; db?: string };
      })
      .then((data) => {
        if (active) {
          setHealth({ status: 'ok', db: data.db ?? 'unknown' });
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : 'Request failed';
          setHealth({ status: 'error', message });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '48px auto', padding: 24 }}>
      <h1>{appName}</h1>
      <p>Frontend deployed via Komodo &amp; Tailscale.</p>
      <section style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
        <strong>API Health (/api/health): </strong>
        {health.status === 'loading' && <span>Checking...</span>}
        {health.status === 'ok' && <span>Connected (DB: {health.db})</span>}
        {health.status === 'error' && <span>Unavailable ({health.message})</span>}
      </section>
    </main>
  );
}
