import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const CITIES_SERVED = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'
];

const STATS = [
  { label: 'Satisfied Renters', value: '100,000+' },
  { label: 'Sanitized Vehicles', value: '2,500+' },
  { label: 'Cities Across India', value: '10+' },
  { label: 'Customer Rating', value: '4.9/5' },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ paddingTop: 100, paddingBottom: 60, flex: 1 }}>
        <div className="container">
          <div className="section-header text-center" style={{ maxWidth: 680, margin: '0 auto 40px' }}>
            <span className="section-label">About NextRent</span>
            <h1 className="section-title">Reinventing <span>Self-Drive Car Rental</span></h1>
            <p className="section-desc">
              NextRent provides seamless, door-delivered self-drive cars with zero security deposit worries and unlimited kilometers.
            </p>
          </div>

          <div className="grid-4" style={{ marginBottom: 48 }}>
            {STATS.map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: 20, textAlign: 'center', background: '#FFFFFF' }}>
                <h2 style={{ fontSize: 32, color: 'var(--color-accent)', fontWeight: 800, margin: 0 }}>{s.value}</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center', marginBottom: 48 }} className="about-grid">
            <div>
              <span className="section-label">Our Mission</span>
              <h2 style={{ fontSize: 26, marginBottom: 14, color: 'var(--color-text)' }}>Empowering Indian Drivers with Complete Freedom</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.7, marginBottom: 12 }}>
                We believe having a car should be simple—accessible on demand without the burdens of ownership, EMI payments, or maintenance.
              </p>
              <p style={{ fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.7 }}>
                Every vehicle in our fleet is deep-sanitized, digitally verified, and insured with All India Tourist Permits.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: '#FFFFFF' }}>
              <h3 style={{ fontSize: 18, marginBottom: 4, color: 'var(--color-text)' }}>The NextRent Promise</h3>
              {[
                { title: 'Doorstep Delivery & Pickup', desc: 'We deliver your chosen car right to your home or airport hub.' },
                { title: 'Unlimited Kilometers Package', desc: 'No capping on how far you drive. Zero extra km fees.' },
                { title: 'Comprehensive Insurance', desc: 'All cars come with commercial insurance & zero financial liability.' },
                { title: '100% Transparent Tariff', desc: 'No hidden taxes or unexpected surcharges.' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10 }}>
                  <FiCheckCircle size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong style={{ color: 'var(--color-text)', fontSize: 14, display: 'block' }}>{item.title}</strong>
                    <span style={{ fontSize: 12, color: 'var(--color-text-2)' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 28, textAlign: 'center', background: '#FFFFFF' }}>
            <span className="section-label" style={{ marginBottom: 12 }}>Presence</span>
            <h2 style={{ fontSize: 22, marginBottom: 18, color: 'var(--color-text)' }}>Serving Major Metros Across India</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {CITIES_SERVED.map(city => (
                <div
                  key={city}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}
                >
                  📍 {city}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 850px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
