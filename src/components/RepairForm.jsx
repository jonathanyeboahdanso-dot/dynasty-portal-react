import { useState } from 'react';

export default function RepairForm({ onAddTicket }) {
  const [clientName, setClientName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !deviceType || !issueDescription) return;

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName,
      deviceType,
      issueDescription,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddTicket(newTicket);

    setClientName('');
    setDeviceType('');
    setIssueDescription('');
  };

  return (
    <section id="request-service" className="card">
      <h3>Submit Diagnostic Request</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="client-name">Client / Owner Name</label>
          <input 
            type="text" 
            id="client-name" 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter full name" 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="device-type">Device Type</label>
          <select 
            id="device-type" 
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            required
          >
            <option value="" disabled>Select device type...</option>
            <option value="laptop">Laptop / Notebook</option>
            <option value="desktop">Desktop PC / Workstation</option>
            <option value="storage">Storage Drive (SSD/HDD Recovery)</option>
            <option value="mobile">Mobile Device / Tablet</option>
            <option value="other">Other Component</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="issue-description">Observed Issue / Fault Symptoms</label>
          <textarea 
            id="issue-description" 
            rows="4" 
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            placeholder="Describe boot errors, beep codes, or power failures..." 
            required
          ></textarea>
        </div>

        <button type="submit" className="btn success-btn">Log Request Ticket</button>
      </form>
    </section>
  );
}