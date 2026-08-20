import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitterX, BsYoutube, BsWhatsapp } from 'react-icons/bs';
import { FiMail, FiPhone, FiMapPin, FiShield, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import logoImg from '../../assets/logo1.jpeg';
import { useTenant } from '../../contexts/TenantContext';

export default function Footer() {
  const { settings } = useTenant();

  const footerLinks = {
    QuickNav: [
      { label: 'Home Page',    to: '/' },
      { label: 'Our Fleet',    to: '/fleet' },
      { label: 'About Us',     to: '/about' },
      { label: 'Contact Us',   to: '/contact' },
      { label: 'My Inquiries', to: '/my-inquiries' },
    ],
    Categories: [
      { label: 'Hatchbacks',  to: '/fleet?category=hatchback' },
      { label: 'Sedans',      to: '/fleet?category=sedan' },
      { label: 'SUV & 4x4',   to: '/fleet?category=suv' },
      { label: 'Luxury Cars', to: '/fleet?category=luxury' },
    ],
    Services: [
      { label: 'Daily Rental',          to: '/fleet' },
      { label: 'Weekly Package',        to: '/fleet' },
      { label: 'Monthly Subscriptions', to: '/fleet' },
      { label: 'Doorstep Delivery',     to: '/fleet' },
    ],
  };

  const socials = [
    { icon: <BsFacebook />,  href: settings?.facebook || '#', label: 'Facebook' },
    { icon: <BsInstagram />, href: settings?.instagram || '#', label: 'Instagram' },
    { icon: <BsTwitterX />,  href: settings?.twitter || '#', label: 'Twitter/X' },
    { icon: <BsYoutube />,   href: settings?.youtube || '#', label: 'YouTube' },
  ];

  const rawPhone = settings?.phone || '+91 9270762176';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const rawWhatsapp = settings?.whatsapp || cleanPhone || '919270762176';
  const whatsappNumber = rawWhatsapp.startsWith('91') ? rawWhatsapp : `91${rawWhatsapp}`;

  return (
    <footer className="footer-root" style={{
      background: 'linear-gradient(180deg, #111318 0%, #090A0E 100%)',
      position: 'relative',
      marginTop: 'auto',
      color: '#F1F5F9',
      borderTop: '1px solid rgba(200, 0, 10, 0.30)',
    }}>
      {/* Top Glowing Gradient Accent Bar */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, #E50010 0%, #C8000A 50%, #800006 100%)',
        width: '100%',
        boxShadow: '0 0 20px rgba(229,0,16,0.6)',
      }} />

      <div style={{ padding: 'clamp(36px, 5vw, 56px) 0 24px' }}>
        <div className="container">
          <div className="footer-grid">

            {/* ── 1. Brand & Identity Column ── */}
            <div className="footer-brand-col">
              <Link to="/" style={{ display: 'inline-block', marginBottom: 14, textDecoration: 'none' }}>
                <div style={{
                  background: '#FFFFFF',
                  padding: '7px 12px',
                  borderRadius: 12,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                  display: 'inline-block',
                }}>
                  <img
                    src={logoImg}
                    alt={settings?.businessName || 'SA Self Drive Cars'}
                    style={{
                      height: 'clamp(42px, 5vw, 52px)',
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              </Link>
              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginBottom: 14, maxWidth: 320 }}>
                {settings?.tagline || 'Premium self-drive car rentals with 300 km daily limit, doorstep delivery & verified fleet in Pune.'}
              </p>

              {/* Social Media Links */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: 36, height: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#CBD5E1',
                      fontSize: 14,
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#C8000A'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#C8000A'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── 2. Link Navigation Columns ── */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="footer-links-col">
                <h4 style={{
                  fontSize: 11, fontWeight: 800, color: '#FF3333',
                  letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: 14,
                }}>{group}</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, listStyle: 'none', padding: 0, margin: 0 }}>
                  {links.map(link => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        style={{
                          fontSize: 13,
                          color: '#94A3B8',
                          textDecoration: 'none',
                          transition: 'all 0.18s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.transform = 'translateX(0)'; }}
                      >
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ── 3. Dynamic Contact & Instant Booking Card ── */}
            <div className="footer-contact-col">
              <h4 style={{
                fontSize: 11, fontWeight: 800, color: '#FF3333',
                letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: 14,
              }}>Contact Us</h4>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 16, listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                  <a
                    href={`tel:${rawPhone.replace(/\s+/g, '')}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      fontSize: 13, color: '#F1F5F9', textDecoration: 'none',
                      fontWeight: 600, transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF3333'}
                    onMouseLeave={e => e.currentTarget.style.color = '#F1F5F9'}
                  >
                    <span style={{ color: '#E50010', flexShrink: 0 }}><FiPhone size={14} /></span>
                    {rawPhone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings?.email || 'info@saselfdrivecars.com'}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      fontSize: 13, color: '#94A3B8', textDecoration: 'none',
                      transition: 'color 0.15s',
                      wordBreak: 'break-all',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
                  >
                    <span style={{ color: '#E50010', flexShrink: 0 }}><FiMail size={14} /></span>
                    {settings?.email || 'info@saselfdrivecars.com'}
                  </a>
                </li>
                <li>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    fontSize: 13, color: '#94A3B8',
                  }}>
                    <span style={{ color: '#E50010', flexShrink: 0 }}><FiMapPin size={14} /></span>
                    {settings?.address || 'Pune, Maharashtra'}
                  </span>
                </li>
              </ul>

              {/* Dynamic WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(settings?.businessName || 'SA Self Drive Cars')},%20I%20want%20to%20book%20a%20car.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  padding: '9px 16px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #25D366 0%, #1EAA52 100%)',
                  color: '#FFFFFF',
                  fontSize: 12.5,
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                  transition: 'all 0.15s ease',
                  width: 'auto',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <BsWhatsapp size={15} /> Book on WhatsApp
              </a>
            </div>

          </div>

          {/* ── Bottom Divider & Copyright Bar ── */}
          <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.08)', margin: 'clamp(24px, 4vw, 36px) 0 16px' }} />

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap', gap: 12, textAlign: 'center',
          }}>
            <p style={{ fontSize: 12, color: '#64748B', margin: 0, fontWeight: 500 }}>
              © {new Date().getFullYear()} <strong style={{ color: '#E2E8F0' }}>{settings?.businessName || 'SA Self Drive Cars'}</strong>. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(0, 1fr)) minmax(0, 1.3fr);
          gap: clamp(16px, 2.5vw, 32px);
          align-items: start;
        }
        @media (max-width: 1180px) {
          .footer-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          .footer-brand-col {
            grid-column: span 2;
          }
          .footer-contact-col {
            grid-column: span 1;
          }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 22px;
          }
          .footer-brand-col {
            grid-column: span 2;
            margin-bottom: 6px;
          }
          .footer-contact-col {
            grid-column: span 2;
            margin-top: 4px;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px 12px;
          }
          .footer-brand-col {
            grid-column: span 2;
          }
          .footer-contact-col {
            grid-column: span 2;
          }
          .footer-contact-col a[href^="https://wa.me"] {
            width: 100% !important;
          }
        }
      `}</style>
    </footer>
  );
}
