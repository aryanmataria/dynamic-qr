import { useState } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState('');
  const [savingSlug, setSavingSlug] = useState(null);

  async function loadCodes(pw) {
    setError('');
    const res = await fetch('/api/admin/list', {
      headers: { 'x-admin-password': pw },
    });
    if (!res.ok) {
      setError('Wrong password or server error.');
      return;
    }
    const json = await res.json();
    setCodes(json.codes);
    setUnlocked(true);
  }

  async function saveRow(row) {
    setSavingSlug(row.slug);
    const res = await fetch('/api/admin/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({
        slug: row.slug,
        destination_url: row.destination_url,
        business_name: row.business_name,
      }),
    });
    setSavingSlug(null);
    if (!res.ok) {
      alert('Failed to save. Check the password / connection.');
    }
  }

  function updateField(slug, field, value) {
    setCodes((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, [field]: value } : c))
    );
  }

  if (!unlocked) {
    return (
      <div style={{ maxWidth: 360, margin: '4rem auto', fontFamily: 'sans-serif' }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button onClick={() => loadCodes(password)} style={{ width: '100%', padding: 8 }}>
          Log in
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Your QR Codes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: 8 }}>Slug</th>
            <th style={{ padding: 8 }}>Business Name</th>
            <th style={{ padding: 8 }}>Destination URL</th>
            <th style={{ padding: 8 }}>Scans</th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {codes.map((row) => (
            <tr key={row.slug} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8, fontFamily: 'monospace' }}>{row.slug}</td>
              <td style={{ padding: 8 }}>
                <input
                  value={row.business_name || ''}
                  onChange={(e) => updateField(row.slug, 'business_name', e.target.value)}
                  style={{ width: '100%', padding: 4 }}
                />
              </td>
              <td style={{ padding: 8 }}>
                <input
                  value={row.destination_url || ''}
                  onChange={(e) => updateField(row.slug, 'destination_url', e.target.value)}
                  style={{ width: '100%', padding: 4 }}
                  placeholder="https://..."
                />
              </td>
              <td style={{ padding: 8 }}>{row.scan_count || 0}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => saveRow(row)} disabled={savingSlug === row.slug}>
                  {savingSlug === row.slug ? 'Saving…' : 'Save'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
