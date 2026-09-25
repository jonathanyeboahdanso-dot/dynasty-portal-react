import { useState } from 'react';

export default function StatusCard() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = (e) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);

    // Dynamic API URL for production (Vercel) & local dev fallback
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    fetch(`${API_BASE}/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch diagnosis');
        return res.json();
      })
      .then((data) => {
        setResult(data.diagnosis);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Diagnostic API Error:', err);
        setResult('Error connecting to diagnostic engine.');
        setLoading(false); // Fixed camelCase typo
      });
  };

  return (
    <section id="diagnostics" className="card">
      <h3>Automated Triage & Hardware Diagnostic Engine</h3>
      <form onSubmit={handleDiagnose} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <label htmlFor="symptoms">Describe Hardware/Software Issue:</label>
          <textarea
            id="symptoms"
            rows="3"
            placeholder="e.g., Laptop screen flickers when moved, CPU overheating..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Analyzing System...' : 'Run Automated Diagnostic'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#1a1a1a', borderRadius: '6px' }}>
          <h4>Recommended Resolution:</h4>
          <p>{result}</p>
        </div>
      )}
    </section>
  );
}