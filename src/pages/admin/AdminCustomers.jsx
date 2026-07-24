import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

import AdminLayout from '../../components/layout/AdminLayout';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCustomers, formatTimestamp } from '../../firebase/firestore';

export default function AdminCustomers() {
  const { tenantId } = useTenant();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = subscribeToCustomers(tenantId, (data) => {
      setCustomers(data);
      setLoading(false);
    });
    return () => unsub();
  }, [tenantId]);

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: 24, margin: 0, color: 'var(--color-text)' }}>Customer Roster (CRM)</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>
            Scope: <strong>{tenantId}</strong>
          </p>
        </div>

        {/* Search */}
        <div className="glass-card" style={{ padding: 14, background: '#FFFFFF' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-3)' }} />
            <input
              type="text"
              placeholder="Search by customer name, email, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 36, height: 38 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ padding: 20, background: '#FFFFFF' }}>
          {loading ? (
            <p style={{ color: 'var(--color-text-2)', fontSize: 13 }}>Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-title">No customer records yet</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Last Activity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => (
                    <tr key={c.id}>
                      <td>
                        <strong style={{ color: 'var(--color-text)' }}>{c.name}</strong>
                      </td>
                      <td>✉️ {c.email}</td>
                      <td>📞 {c.phone}</td>
                      <td>{formatTimestamp(c.lastBooking || c.createdAt)}</td>
                      <td>
                        <span className="badge badge-success">Verified Renter</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
