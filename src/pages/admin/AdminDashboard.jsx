import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTruck,
  FiMessageSquare,
  FiUsers,
  FiDollarSign,
  FiEye,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';

import { useTenant } from '../../contexts/TenantContext';
import {
  subscribeToCars,
  subscribeToInquiries,
  subscribeToCustomers,
  updateInquiryStatus,
  formatTimestamp,
} from '../../firebase/firestore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function AdminDashboard() {
  const { tenantId } = useTenant();

  const [cars, setCars] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const unsubCars = subscribeToCars(tenantId, setCars);
    const unsubInquiries = subscribeToInquiries(tenantId, (data) => {
      setInquiries(data);
      setLoading(false);
    });
    const unsubCustomers = subscribeToCustomers(tenantId, setCustomers);

    return () => {
      unsubCars();
      unsubInquiries();
      unsubCustomers();
    };
  }, [tenantId]);

  const newInquiries = inquiries.filter(i => i.status === 'new');
  const confirmedInquiries = inquiries.filter(i => i.status === 'confirmed');
  const estimatedRevenue = confirmedInquiries.reduce((sum, i) => sum + (i.estimatedPrice || 1499), 0);

  const categoryCounts = cars.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateInquiryStatus(tenantId, id, status);
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0, color: 'var(--color-text)' }}>CRM Dashboard</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>
              Multi-Tenant Scope: <strong style={{ color: 'var(--color-accent)' }}>{tenantId}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/admin/cars" className="btn btn-secondary btn-sm">
              <FiTruck /> Fleet
            </Link>
            <Link to="/admin/inquiries" className="btn btn-primary btn-sm">
              <FiMessageSquare /> All Inquiries ({inquiries.length})
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid-4">
          <StatCard
            title="Total Cars Fleet"
            value={cars.length}
            icon={<FiTruck />}
            color="accent"
            subtitle={`${cars.filter(c => c.isActive !== false).length} Active Vehicles`}
          />

          <StatCard
            title="Total Inquiries"
            value={inquiries.length}
            icon={<FiMessageSquare />}
            color="blue"
            subtitle={`${newInquiries.length} New Unread`}
          />

          <StatCard
            title="Registered Renters"
            value={customers.length}
            icon={<FiUsers />}
            color="warning"
            subtitle="Unique verified customers"
          />

          <StatCard
            title="Confirmed Pipeline"
            value={formatCurrency(estimatedRevenue)}
            icon={<FiDollarSign />}
            color="success"
            subtitle={`${confirmedInquiries.length} Confirmed Bookings`}
          />
        </div>

        {/* Dashboard Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }} className="dashboard-grid">
          {/* Table */}
          <div className="glass-card" style={{ padding: 20, background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, margin: 0, color: 'var(--color-text)' }}>Recent Rental Inquiries</h3>
              <Link to="/admin/inquiries" style={{ fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 700 }}>
                View All →
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--color-text-2)', fontSize: 13 }}>Loading inquiries...</p>
            ) : inquiries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📬</div>
                <div className="empty-state-title">No inquiries received yet</div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Car Requested</th>
                      <th>City</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 6).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong style={{ color: 'var(--color-text)', display: 'block' }}>{item.customerName}</strong>
                          <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{item.phone}</span>
                        </td>
                        <td>{item.carName || 'General'}</td>
                        <td>📍 {item.city || 'Mumbai'}</td>
                        <td>{formatTimestamp(item.pickupDate)}</td>
                        <td>
                          <select
                            className="form-select"
                            value={item.status || 'new'}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                            style={{ padding: '2px 6px', fontSize: 11, height: 28, width: 110 }}
                          >
                            <option value="new">🟡 New</option>
                            <option value="contacted">🔵 Contacted</option>
                            <option value="confirmed">🟢 Confirmed</option>
                            <option value="closed">🔴 Closed</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn-icon"
                            onClick={() => {
                              setSelectedInquiry(item);
                              setIsDetailOpen(true);
                            }}
                          >
                            <FiEye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-card" style={{ padding: 20, background: '#FFFFFF' }}>
              <h3 style={{ fontSize: 16, marginBottom: 16, color: 'var(--color-text)' }}>Fleet by Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'hatchback', label: 'Hatchback', color: 'var(--color-accent)' },
                  { id: 'sedan', label: 'Sedan', color: 'var(--color-blue)' },
                  { id: 'suv', label: 'SUV & 4x4', color: 'var(--color-warning)' },
                  { id: 'premium', label: 'Luxury', color: 'var(--color-success)' },
                ].map(cat => {
                  const count = categoryCounts[cat.id] || 0;
                  const pct = cars.length > 0 ? Math.round((count / cars.length) * 100) : 0;
                  return (
                    <div key={cat.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{cat.label}</span>
                        <span style={{ color: 'var(--color-text-3)' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'var(--color-bg-alt)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20, background: '#FFFFFF' }}>
              <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--color-text)' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to="/admin/cars" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
                  ➕ Add New Car Listing
                </Link>
                <Link to="/admin/inquiries" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
                  📩 Export Inquiries
                </Link>
                <Link to="/admin/customers" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
                  👥 View Customer Roster
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Inquiry Detail & Follow-up"
      >
        {selectedInquiry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <strong style={{ fontSize: 16, color: 'var(--color-text)', display: 'block' }}>{selectedInquiry.customerName}</strong>
              <span style={{ fontSize: 13, color: 'var(--color-text-2)' }}>
                📞 {selectedInquiry.phone} • ✉️ {selectedInquiry.email}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Vehicle Requested</span>
                <strong style={{ color: 'var(--color-accent)' }}>{selectedInquiry.carName || 'General'}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Location & Type</span>
                <strong style={{ color: 'var(--color-text)' }}>📍 {selectedInquiry.city} ({selectedInquiry.pickupType})</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Pickup Date</span>
                <strong style={{ color: 'var(--color-text)' }}>{formatTimestamp(selectedInquiry.pickupDate)}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Return Date</span>
                <strong style={{ color: 'var(--color-text)' }}>{formatTimestamp(selectedInquiry.returnDate)}</strong>
              </div>
            </div>

            {selectedInquiry.message && (
              <div style={{ padding: 10, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-alt)' }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Message:</span>
                <p style={{ fontSize: 13, color: 'var(--color-text-2)', margin: '2px 0 0' }}>{selectedInquiry.message}</p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select
                className="form-select"
                value={selectedInquiry.status || 'new'}
                onChange={(e) => {
                  handleStatusUpdate(selectedInquiry.id, e.target.value);
                  setSelectedInquiry({ ...selectedInquiry, status: e.target.value });
                }}
              >
                <option value="new">🟡 New</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="confirmed">🟢 Confirmed</option>
                <option value="closed">🔴 Closed</option>
              </select>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        @media (max-width: 960px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
