import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiTruck, FiShield, FiMapPin,
  FiStar, FiUsers, FiKey, FiClock,
} from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const STATS = [
  { label: 'Happy Renters', value: '100,000+', icon: <FiUsers size={22} /> },
  { label: 'Sanitized Vehicles', value: '2,500+', icon: <BsCarFront size={22} /> },
  { label: 'Cities Across India', value: '10+', icon: <FiMapPin size={22} /> },
  { label: 'Customer Rating', value: '4.9/5', icon: <FiStar size={22} /> },
];

const PROMISES = [
  {
    icon: <FiTruck size={24} />,
    title: 'Doorstep Delivery',
    desc: 'We deliver your chosen car right to your home or airport hub within 30 minutes.',
  },
  {
    icon: <FiKey size={24} />,
    title: 'Unlimited Kilometers',
    desc: 'No capping on how far you drive. Absolutely zero extra km charges.',
  },
  {
    icon: <FiShield size={24} />,
    title: 'Full Insurance Covered',
    desc: 'All cars come with commercial insurance and zero financial liability.',
  },
  {
    icon: <FiCheckCircle size={24} />,
    title: '100% Transparent Tariff',
    desc: 'No hidden taxes, no surprise surcharges — pay only what you see.',
  },
  {
    icon: <FiClock size={24} />,
    title: '24/7 Support',
    desc: 'Our team is available round the clock to assist you during your trip.',
  },
  {
    icon: <FiStar size={24} />,
    title: 'Deep Sanitized Fleet',
    desc: 'Every vehicle is digitally verified, insured and deep-sanitized before handover.',
  },
];

const CITIES_SERVED = [
  'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad',
  'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh',
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 72, paddingBottom: 36, flex: 1 }}>

        {/* ─── Hero Header ─── */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F1F5F9', marginBottom: 32 }}>
          <div className="container" style={{ padding: '32px 16px 28px' }}>
            <span className="section-label-red" style={{ marginBottom: 10, display: 'inline-block' }}>About NextRent</span>
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, color: '#0F172A', margin: '0 0 10px', lineHeight: 1.2 }}>
              Reinventing <span style={{ color: '#EF4444' }}>Self-Drive Car Rental</span>
            </h1>
            <p style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: '#475569', margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
              NextRent provides seamless, door-delivered self-drive cars with zero security deposit worries, unlimited kilometers, and 100% transparent pricing.
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '0 16px' }}>

          {/* ─── Stats Grid ─── */}
          <div className="about-stats-grid" style={{ marginBottom: 32 }}>
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  padding: '20px 16px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(255,255,255,0.9) 100%)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {s.icon}
                </div>
                <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: '#EF4444', fontWeight: 800, margin: 0, lineHeight: 1 }}>
                  {s.value}
                </h2>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, fontWeight: 600 }}>{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ─── Mission + Promise Grid ─── */}
          <div className="about-mission-grid" style={{ marginBottom: 32 }}>
            {/* Mission Text */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '24px 22px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            }}>
              <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 10 }}>Our Mission</span>
              <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#0F172A', marginBottom: 14, lineHeight: 1.3 }}>
                Empowering Indian Drivers with Complete Freedom
              </h2>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
                We believe having a car should be simple — accessible on demand without the burdens of ownership, EMI payments, or maintenance hassle.
              </p>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 20 }}>
                Every vehicle in our fleet is deep-sanitized, digitally verified, and insured with All India Tourist Permits so you can drive worry-free.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Zero Deposit', 'Unlimited KM', 'Doorstep Delivery', 'Insured Rides'].map(tag => (
                  <span key={tag} style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(255,255,255,0.9) 100%)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#EF4444',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* NextRent Promise List */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '24px 22px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            }}>
              <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 10 }}>Our Promise</span>
              <h2 style={{ fontSize: 'clamp(17px, 3vw, 22px)', fontWeight: 800, color: '#0F172A', marginBottom: 18, lineHeight: 1.3 }}>
                The NextRent Commitment
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <FiTruck size={16} />, title: 'Doorstep Delivery & Pickup', desc: 'Car delivered to your home or airport hub within 30 mins.' },
                  { icon: <FiKey size={16} />, title: 'Unlimited Kilometers Package', desc: 'No capping on how far you drive. Zero extra km fees.' },
                  { icon: <FiShield size={16} />, title: 'Comprehensive Insurance', desc: 'Commercial insurance with zero financial liability.' },
                  { icon: <FiCheckCircle size={16} />, title: '100% Transparent Tariff', desc: 'No hidden taxes or unexpected surcharges.' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(255,255,255,0.9) 100%)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <strong style={{ color: '#0F172A', fontSize: 14, display: 'block', marginBottom: 2 }}>{item.title}</strong>
                      <span style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Why Choose Us Card Grid ─── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 20 }}>
              <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 6 }}>Why NextRent</span>
              <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Everything You Need, Nothing You Don't
              </h2>
            </div>
            <div className="about-cards-grid">
              {PROMISES.map((p, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    padding: '20px 18px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                    cursor: 'default',
                  }}
                >
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(255,255,255,0.9) 100%)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    {p.icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ─── Cities Presence ─── */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '24px 22px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}>
            <div style={{ marginBottom: 16 }}>
              <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 6 }}>Presence</span>
              <h2 style={{ fontSize: 'clamp(17px, 3vw, 22px)', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Serving Major Metros Across India
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CITIES_SERVED.map(city => (
                <div key={city} style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <FiMapPin size={12} style={{ color: '#EF4444' }} /> {city}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .about-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .about-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .about-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .about-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .about-mission-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .about-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .about-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
