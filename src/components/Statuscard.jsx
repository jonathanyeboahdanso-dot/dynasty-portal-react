import { useState } from 'react';

export default function StatusCard() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = (e) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);
    fetch('http://localhost:5000/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data.diagnosis);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Diagnostic API Error:', err);
        setLoading(false);
      });
  };

  return (
    <section id="diagnostics" className="card">
      <h3>Automated Triage & Hardware Diagnostic Engine</h3>
      <form onSubmit={handleDiagnose} style={{ marginTop: '1rem' }}>
        <div className="form-group">
          <input 
            type="text" 
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Type symptoms (e.g., '3 beeps no display', 'blue screen crash', 'sudden power off')..."
            required
          />
        </div>
        <button type="submit" className="btn primary-btn" disabled={loading}>
          {loading ? 'Analyzing Hardware Bus...' : 'Run Diagnostic AI'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #3b82f6' }}>
          <p style={{ color: '#60a5fa', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            Diagnostic Category: {result.category} ({result.severity} Severity)
          </p>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Action Plan:</strong> {result.recommendedAction}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            <strong>Possible Root Causes:</strong> {result.possibleCauses.join(', ')}
          </p>
        </div>
      )}
    </section>
  );
}