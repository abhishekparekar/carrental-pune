import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import { useTenant } from '../../contexts/TenantContext';
import { addInquiry } from '../../firebase/firestore';

export default function ContactPage() {
  const { tenantId } = useTenant();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.email || !form.phone || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await addInquiry(tenantId, {
        carId: null,
        carName: 'General Inquiry',
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        message: form.message,
        pickupType: 'self-pickup',
      });
      setSubmitted(true);
      toast.success('Inquiry submitted successfully!');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Failed to submit message. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ paddingTop: 100, paddingBottom: 60, flex: 1 }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: 600, margin: '0 auto 36px' }}>
            <span className="section-label">Get in Touch</span>
            <h1 className="section-title">We’re Here to <span>Help You Drive</span></h1>
            <p className="section-desc">
              Have a question about our self-drive fleet, corporate rentals, or doorstep delivery? Contact our 24/7 team.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 32 }} className="contact-grid">
            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="glass-card" style={{ padding: 24, background: '#FFFFFF' }}>
                <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--color-text)' }}>Contact Information</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-bg)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      <FiPhone />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text)', fontSize: 14 }}>Call Center & WhatsApp (24/7)</strong>
                      <a href="https://wa.me/918485877633" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-2)', fontSize: 14, textDecoration: 'none' }}>+91 8485877633</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-blue-bg)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      <FiMail />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text)', fontSize: 14 }}>Email Support</strong>
                      <a href="mailto:support@nextrent.com" style={{ color: 'var(--color-text-2)', fontSize: 14, textDecoration: 'none' }}>support@nextrent.com</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      <FiMapPin />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text)', fontSize: 14 }}>Headquarters</strong>
                      <p style={{ color: 'var(--color-text-2)', fontSize: 14, margin: 0 }}>NextRent Hub, Bandra Kurla Complex, Mumbai, MH 400051</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      <FiClock />
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text)', fontSize: 14 }}>Working Hours</strong>
                      <p style={{ color: 'var(--color-text-2)', fontSize: 14, margin: 0 }}>Operating 24/7 • 365 Days a Year</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="glass-card" style={{ padding: 28, background: '#FFFFFF' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <FiCheckCircle size={44} style={{ color: 'var(--color-success)', marginBottom: 12 }} />
                  <h3>Message Sent Successfully!</h3>
                  <p style={{ color: 'var(--color-text-2)', marginTop: 6, fontSize: 14 }}>
                    We have received your message and will respond within 2 hours.
                  </p>
                  <button className="btn btn-secondary btn-sm" onClick={() => setSubmitted(false)} style={{ marginTop: 14 }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 18, margin: 0, color: 'var(--color-text)' }}>Send us a Message</h3>

                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Jane Smith"
                      value={form.customerName}
                      onChange={e => setForm({ ...form, customerName: e.target.value })}
                    />
                  </div>

                  <div className="grid-2" style={{ gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select
                      className="form-select"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                    >
                      {['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea
                      required
                      rows={3}
                      className="form-textarea"
                      placeholder="How can we assist you?"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
                    {submitting ? 'Submitting...' : 'Send Message'} <FiSend />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 850px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
