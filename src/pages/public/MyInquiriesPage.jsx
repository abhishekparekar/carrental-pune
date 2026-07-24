import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useTenant } from '../../contexts/TenantContext';
import { subscribeToInquiries, formatTimestamp } from '../../firebase/firestore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function MyInquiriesPage() {
  const { tenantId } = useTenant();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setLoading(true);
    setSearched(true);

    const unsub = subscribeToInquiries(tenantId, (all) => {
      const q = emailOrPhone.toLowerCase().trim();
      const userItems = all.filter(item => 
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phone && item.phone.includes(q))
      );
      setInquiries(userItems);
      setLoading(false);
    });

    return () => unsub();
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'new': return <span className="badge badge-warning">New Inquiry</span>;
      case 'contacted': return <span className="badge badge-blue">Agent Contacted</span>;
      case 'confirmed': return <span className="badge badge-success">Booking Confirmed</span>;
      case 'closed': return <span className="badge badge-error">Closed / Cancelled</span>;
      default: return <span className="badge badge-accent">{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ paddingTop: 100, paddingBottom: 60, flex: 1 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label">Track Your Request</span>
            <h1 className="section-title">My Rental <span>Inquiries</span></h1>
            <p className="section-desc">
              Enter the phone number or email address used during your inquiry to view status updates.
            </p>
          </div>

          <form onSubmit={handleSearch} className="glass-card" style={{ padding: 16, display: 'flex', gap: 10, marginBottom: 32, background: '#FFFFFF' }}>
            <input
              type="text"
              required
              className="form-input"
              placeholder="Enter Email or Mobile Number (+91...)"
              value={emailOrPhone}
              onChange={e => setEmailOrPhone(e.target.value)}
              style={{ fontSize: 15 }}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Search Status <FiSearch />
            </button>
          </form>

          {searched && (
            <div>
              {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-2)', fontSize: 13 }}>Searching records...</p>
              ) : inquiries.length === 0 ? (
                <div className="glass-card empty-state" style={{ background: '#FFFFFF' }}>
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-title">No inquiries found</div>
                  <div className="empty-state-desc">
                    We couldn't find any rental inquiries matching "{emailOrPhone}".
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {inquiries.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card"
                      style={{ padding: 20, background: '#FFFFFF' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>
                            Ref: #{item.id.slice(0, 8)}
                          </span>
                          <h3 style={{ fontSize: 16, margin: 0, color: 'var(--color-text)' }}>{item.carName || 'General Inquiry'}</h3>
                        </div>
                        {statusBadge(item.status)}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                        <div>
                          <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Location</span>
                          <strong style={{ fontSize: 13, color: 'var(--color-text)' }}>📍 {item.city || 'Mumbai'}</strong>
                        </div>

                        <div>
                          <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Delivery</span>
                          <strong style={{ fontSize: 13, color: 'var(--color-text)', textTransform: 'capitalize' }}>
                            🚗 {item.pickupType || 'Delivery'}
                          </strong>
                        </div>

                        <div>
                          <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Submitted</span>
                          <strong style={{ fontSize: 13, color: 'var(--color-text)' }}>
                            {formatTimestamp(item.createdAt)}
                          </strong>
                        </div>

                        {item.estimatedPrice && (
                          <div>
                            <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Est. Total</span>
                            <strong style={{ fontSize: 14, color: 'var(--color-accent)' }}>
                              {formatCurrency(item.estimatedPrice)}
                            </strong>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
