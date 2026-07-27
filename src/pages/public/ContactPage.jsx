import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin, FiSend, FiClock,
  FiCheckCircle, FiMessageCircle, FiArrowRight,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { addInquiry } from '../../firebase/firestore';

const CONTACT_ITEMS = [
  {
    icon: <FiPhone size={20} />,
    label: 'Call / WhatsApp (24/7)',
    value: '+91 9270762176',
    href: 'https://wa.me/919270762176',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
  },
  {
    icon: <FiMail size={20} />,
    label: 'Email Support',
    value: 'support@nextrent.com',
    href: 'mailto:support@nextrent.com',
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.1)',
  },
  {
    icon: <FiMapPin size={20} />,
    label: 'Headquarters',
    value: 'Bandra Kurla Complex, Mumbai, MH 400051',
    href: null,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: <FiClock size={20} />,
    label: 'Working Hours',
    value: '24/7 — 365 Days a Year',
    href: null,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
  },
];

const CITIES = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

export default function ContactPage() {
  const { tenantId } = useTenant();
  const { user } = useAuth();
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
      toast.error('Please fill in all required fields');
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
      }, user?.uid || 'guest');
      setSubmitted(true);
      toast.success('Message sent! We will reply within 2 hours.');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 72, paddingBottom: 36, flex: 1 }}>

        {/* ─── Hero Header ─── */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9', marginBottom: 28 }}>
          <div className="container" style={{ padding: '28px 16px 24px' }}>
            <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 8 }}>Get in Touch</span>
            <h1 style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 800, color: '#0F172A', margin: '0 0 8px', lineHeight: 1.2 }}>
              We're Here to <span style={{ color: '#EF4444' }}>Help You Drive</span>
            </h1>
            <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: '#475569', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
              Have a question about our self-drive fleet, corporate rentals, or doorstep delivery? Our 24/7 team is ready to help.
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '0 16px' }}>

          {/* ─── Contact Info Cards ─── */}
          <div className="contact-info-grid" style={{ marginBottom: 24 }}>
            {CONTACT_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  padding: '18px 16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: item.bg,
                  border: `1px solid ${item.color}30`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{ fontSize: 14, fontWeight: 700, color: item.color, textDecoration: 'none', display: 'block', marginTop: 2, wordBreak: 'break-all' }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', display: 'block', marginTop: 2, lineHeight: 1.4 }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── Main Grid: Form + WhatsApp CTA ─── */}
          <div className="contact-main-grid">
            {/* Contact Form */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '24px 22px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
            }}>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    color: '#10B981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiCheckCircle size={26} />
                  </div>
                  <h3 style={{ fontSize: 20, color: '#0F172A', fontWeight: 800, margin: 0 }}>Message Sent!</h3>
                  <p style={{ fontSize: 13, color: '#475569', maxWidth: 320, margin: 0 }}>
                    We've received your message and will respond within 2 hours.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a
                      href="https://wa.me/919270762176"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <BsWhatsapp size={14} /> WhatsApp Us
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 14px', fontSize: 13 }}
                    >
                      New Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 6 }}>Message Us</span>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>Send a Message</h2>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Your full name"
                      value={form.customerName}
                      onChange={e => setForm({ ...form, customerName: e.target.value })}
                    />
                  </div>

                  <div className="contact-form-row">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
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

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">City</label>
                    <select
                      className="form-select"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      className="form-textarea"
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ resize: 'vertical', minHeight: 90 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-lg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: 14,
                      fontWeight: 800,
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      opacity: submitting ? 0.8 : 1,
                    }}
                  >
                    {submitting ? 'Sending...' : <><FiSend size={15} /> Send Message <FiArrowRight size={14} /></>}
                  </button>
                </form>
              )}
            </div>

            {/* Right Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* WhatsApp Quick CTA */}
              <div style={{
                background: 'linear-gradient(135deg, #25D366 0%, #20B858 100%)',
                borderRadius: 16,
                padding: '22px 20px',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(37,211,102,0.25)',
              }}>
                <BsWhatsapp size={32} style={{ marginBottom: 12, opacity: 0.9 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>Quick Response via WhatsApp</h3>
                <p style={{ fontSize: 13, margin: '0 0 16px', opacity: 0.9, lineHeight: 1.5 }}>
                  Get instant replies from our team on WhatsApp. Average response time under 5 minutes.
                </p>
                <a
                  href="https://wa.me/919270762176?text=Hi%20SA%20Self%20Drive%20Cars!%20I%20need%20help%20with%20a%20car%20rental."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#FFFFFF',
                    color: '#25D366',
                    fontWeight: 800,
                    fontSize: 13,
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-full)',
                    textDecoration: 'none',
                  }}
                >
                  <BsWhatsapp size={15} /> Chat on WhatsApp
                </a>
              </div>

              {/* Quick Info Card */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '20px 18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiMessageCircle style={{ color: '#EF4444' }} size={17} /> Common Questions
                </h3>
                {[
                  { q: 'How quickly is the car delivered?', a: 'Within 30–45 minutes to your doorstep.' },
                  { q: 'Is security deposit required?', a: 'Refundable deposit collected at delivery.' },
                  { q: 'Are kilometer charges applicable?', a: 'No — all packages include unlimited KM.' },
                  { q: 'Can I extend my rental duration?', a: 'Yes, call or WhatsApp us anytime to extend.' },
                ].map((faq, i) => (
                  <div key={i} style={{ borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none', paddingBottom: i < 3 ? 10 : 0, marginBottom: i < 3 ? 10 : 0 }}>
                    <strong style={{ fontSize: 13, color: '#0F172A', display: 'block', marginBottom: 3 }}>{faq.q}</strong>
                    <span style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{faq.a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
        }
        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .contact-info-grid { grid-template-columns: repeat(2, 1fr); }
          .contact-main-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .contact-info-grid { grid-template-columns: 1fr; gap: 10px; }
          .contact-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
