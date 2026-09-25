import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatusCard from './components/StatusCard';
import RepairForm from './components/RepairForm';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDevice, setFilterDevice] = useState('all');

  useEffect(() => {
    fetch(`${API_BASE_URL}/tickets`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tickets:', err);
        setLoading(false);
      });
  }, []);

  const handleAddTicket = (ticketData) => {
    fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    })
      .then((res) => res.json())
      .then((createdTicket) => {
        setTickets((prev) => [createdTicket, ...prev]);
      })
      .catch((err) => console.error('Error adding ticket:', err));
  };

  const handleUpdateStatus = (id, newStatus) => {
    fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      })
      .catch((err) => console.error('Error updating status:', err));
  };

  const handleDeleteTicket = (id) => {
    fetch(`${API_BASE_URL}/tickets/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        setTickets((prev) => prev.filter((t) => t.id !== id));
      })
      .catch((err) => console.error('Error deleting ticket:', err));
  };

  // Filtered tickets logic
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.issueDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDevice = filterDevice === 'all' || t.deviceType === filterDevice;
    return matchesSearch && matchesDevice;
  });

  return (
    <div className="app-root">
      <Header />
      <main className="container">
        <section className="hero-section">
          <h1>Hardware Diagnostic & Service Portal</h1>
          <p>Full-Stack SQLite Persistence & Diagnostic Engine</p>
        </section>

        <StatusCard />
        <RepairForm onAddTicket={handleAddTicket} />

        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <h3>Logged Support Tickets ({filteredTickets.length})</h3>
            
            {/* Search & Filter Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search ticket ID or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
              <select
                value={filterDevice}
                onChange={(e) => setFilterDevice(e.target.value)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              >
                <option value="all">All Devices</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile / Tablet</option>
                <option value="other">Other Component</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="empty-msg">Loading tickets from SQLite database...</p>
          ) : filteredTickets.length === 0 ? (
            <p className="empty-msg">No tickets match search/filter criteria.</p>
          ) : (
            <div className="ticket-list">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="card ticket-card">
                  <div className="ticket-header">
                    <strong className="ticket-id">{ticket.id}</strong>
                    <span className="ticket-time">{ticket.timestamp}</span>
                  </div>
                  <p><strong>Client:</strong> {ticket.clientName}</p>
                  <p><strong>Device:</strong> {ticket.deviceType.toUpperCase()}</p>
                  <p className="ticket-desc"><strong>Fault:</strong> {ticket.issueDescription}</p>
                  
                  {/* Status Dropdown */}
                  <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Status:{' '}
                      <select
                        value={ticket.status || 'Received'}
                        onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                        style={{ marginLeft: '0.4rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#1e293b', color: '#60a5fa', border: '1px solid #3b82f6' }}
                      >
                        <option value="Received">Received</option>
                        <option value="In Diagnostics">In Diagnostics</option>
                        <option value="Repaired">Repaired</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                      </select>
                    </label>

                    <button 
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="delete-btn"
                    >
                      Clear Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}