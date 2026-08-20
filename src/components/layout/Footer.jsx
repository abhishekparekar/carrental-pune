import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitterX, BsYoutube, BsWhatsapp } from 'react-icons/bs';
import { FiMail, FiPhone, FiMapPin, FiShield, FiZap, FiTruck, FiChevronRight } from 'react-icons/fi';
import logoImg from '../../assets/logo1.jpeg';
import { useTenant } from '../../contexts/TenantContext';

export default function Footer() {
  const { settings } = useTenant();

  const quickLinks = [
    { label: 'Home Page', to: '/' },
    { label: 'Our Fleet', to: '/fleet' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'My Inquiries', to: '/my-inquiries' },
  ];

  const categories = [
    { label: 'Hatchbacks', to: '/fleet?category=hatchback' },
    { label: 'Sedans', to: '/fleet?category=sedan' },
    { label: 'SUV & 4x4', to: '/fleet?category=suv' },
    { label: 'Luxury Fleet', to: '/fleet?category=luxury' },
  ];

  const socials = [
    { icon: <BsFacebook size={15} />, href: settings?.facebook || '#', label: 'Facebook' },
    { icon: <BsInstagram size={15} />, href: settings?.instagram || '#', label: 'Instagram' },
    { icon: <BsTwitterX size={14} />, href: settings?.twitter || '#', label: 'Twitter' },
    { icon: <BsYoutube size={15} />, href: settings?.youtube || '#', label: 'YouTube' },
  ];

  const rawPhone = settings?.phone || '+91 9270762176';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const rawWhatsapp = settings?.whatsapp || cleanPhone || '919270762176';
  const whatsappNumber = rawWhatsapp.startsWith('91') ? rawWhatsapp : `91${rawWhatsapp}`;

  return (
    <footer className="footer-root" style={{
      background: 'linear-gradient(180deg, #0D111A 0%, #06080D 100%)',
      position: 'relative',
      marginTop: 'auto',
      color: '#F1F5F9',
      borderTop: '1px solid rgba(229, 0, 16, 0.25)',
    }}>
      {/* Top Crimson Red Accent Bar */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, #E50010 0%, #C8000A 50%, #700005 100%)',
        width: '100%',
        boxShadow: '0 0 16px rgba(229, 0, 16, 0.4)',
      }} />

      <div style={{ padding: ' clamp(36px, 4.5vw, 52px) 0 20px' }}>
        <div className="container">
          
          <div className="footer-main-grid">

            {/* ── 1. Brand & Identity ── */}
            <div className="footer-col-brand">
              <Link to="/" style={{ display: 'inline-block', marginBottom: 14, textDecoration: 'none' }}>
                <div style={{
                  background: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: 10,
                  display: 'inline-block',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
                }}>
                  <img
                    src={logoImg}
                    alt={settings?.businessName || 'SA Self Drive Cars'}
                    style={{
                      height: 38,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              </Link>
              
              <p style={{
                fontSize: 13.5,
                color: '#94A3B8',
                lineHeight: 1.6,
                marginBottom: 18,
                maxWidth: 320,
              }}>
                {settings?.tagline || 'Pune’s trusted self-drive car rental with 300 km daily limit, doorstep delivery & verified fleet.'}
              </p>

              {/* Social Media Links */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="footer-social-btn"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── 2. Quick Links ── */}
            <div className="footer-col-links">
              <h4 className="footer-col-heading">
                <span className="footer-heading-dot" /> Quick Links
              </h4>
              <ul className="footer-links-list">
                {quickLinks.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="footer-nav-link">
                      <FiChevronRight size={13} className="footer-nav-arrow" />
                      <span>{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── 3. Fleet Categories ── */}
            <div className="footer-col-links">
              <h4 className="footer-col-heading">
                <span className="footer-heading-dot" /> Fleet Categories
              </h4>
              <ul className="footer-links-list">
                {categories.map(c => (
                  <li key={c.label}>
                    <Link to={c.to} className="footer-nav-link">
                      <FiChevronRight size={13} className="footer-nav-arrow" />
                      <span>{c.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── 4. Contact & WhatsApp Card ── */}
            <div className="footer-col-contact">
              <h4 className="footer-col-heading">
                <span className="footer-heading-dot" /> Contact & Booking
              </h4>

              <div className="footer-contact-items">
                <a href={`tel:${rawPhone.replace(/\s+/g, '')}`} className="footer-contact-row">
                  <div className="footer-contact-icon">
                    <FiPhone size={13} />
                  </div>
                  <div>
                    <span className="footer-contact-label">Call Support</span>
                    <strong className="footer-contact-val">{rawPhone}</strong>
                  </div>
                </a>

                <a href={`mailto:${settings?.email || 'info@saselfdrivecars.com'}`} className="footer-contact-row">
                  <div className="footer-contact-icon">
                    <FiMail size={13} />
                  </div>
                  <div>
                    <span className="footer-contact-label">Email Us</span>
                    <span className="footer-contact-val">{settings?.email || 'info@saselfdrivecars.com'}</span>
                  </div>
                </a>

                <div className="footer-contact-row" style={{ cursor: 'default' }}>
                  <div className="footer-contact-icon">
                    <FiMapPin size={13} />
                  </div>
                  <div>
                    <span className="footer-contact-label">Location</span>
                    <span className="footer-contact-val">{settings?.address || 'Pune & PCMC, Maharashtra'}</span>
                  </div>
                </div>
              </div>

              {/* High-Impact WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(settings?.businessName || 'SA Self Drive Cars')},%20I%20want%20to%20inquire%20about%20booking%20a%20car.`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-whatsapp-cta"
              >
                <BsWhatsapp size={16} />
                <span>Book on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* ── Trust Pillars & Divider ── */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.10) 50%, transparent 100%)',
            margin: 'clamp(24px, 3.5vw, 36px) 0 18px',
          }} />

          {/* ── Bottom Copyright Bar ── */}
          <div className="footer-bottom-row">
            <p className="footer-copyright-text">
              © {new Date().getFullYear()} <strong style={{ color: '#F1F5F9' }}>{settings?.businessName || 'SA Self Drive Cars'}</strong>. All rights reserved.
            </p>

            <div className="footer-trust-pills">
              <span className="footer-trust-pill">
                <FiShield size={12} color="#22C55E" /> 100% Verified Fleet
              </span>
              <span className="footer-trust-pill">
                <FiZap size={12} color="#EAB308" /> 300 KM/Day Limit
              </span>
              <span className="footer-trust-pill">
                <FiTruck size={12} color="#38BDF8" /> Doorstep Delivery
              </span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .footer-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.9fr) minmax(0, 0.9fr) minmax(0, 1.35fr);
          gap: clamp(20px, 3vw, 40px);
          align-items: start;
        }

        .footer-col-heading {
          font-size: 12px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-heading-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E50010;
          display: inline-block;
        }

        .footer-social-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.10);
          color: #94A3B8;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-social-btn:hover {
          background: #C8000A;
          color: #FFFFFF;
          border-color: #C8000A;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(200, 0, 10, 0.4);
        }

        .footer-links-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-nav-link {
          font-size: 13.5px;
          color: #94A3B8;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.18s ease;
        }

        .footer-nav-arrow {
          color: #64748B;
          transition: transform 0.18s ease, color 0.18s ease;
        }

        .footer-nav-link:hover {
          color: #FFFFFF;
          transform: translateX(3px);
        }

        .footer-nav-link:hover .footer-nav-arrow {
          color: #E50010;
        }

        .footer-contact-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }

        .footer-contact-row {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.15s ease;
        }

        .footer-contact-row:hover {
          opacity: 0.9;
        }

        .footer-contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(229, 0, 16, 0.12);
          border: 1px solid rgba(229, 0, 16, 0.25);
          color: #E50010;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .footer-contact-label {
          display: block;
          font-size: 10.5px;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          line-height: 1.1;
        }

        .footer-contact-val {
          display: block;
          font-size: 13px;
          color: #E2E8F0;
          font-weight: 600;
          line-height: 1.3;
        }

        .footer-whatsapp-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px 16px;
          border-radius: 10px;
          background: linear-gradient(135deg, #25D366 0%, #15803D 100%);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.30);
          transition: all 0.2s ease;
        }

        .footer-whatsapp-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
        }

        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-copyright-text {
          font-size: 12px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
        }

        .footer-trust-pills {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .footer-trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #94A3B8;
          font-weight: 600;
        }

        /* ── Tablet Responsiveness (768px – 1080px) ── */
        @media (max-width: 1080px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 24px;
          }
          .footer-col-brand {
            grid-column: span 1;
          }
          .footer-col-contact {
            grid-column: span 1;
          }
        }

        /* ── Mobile Responsiveness (< 768px) ── */
        @media (max-width: 768px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 16px;
          }
          .footer-col-brand {
            grid-column: span 2;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .footer-col-contact {
            grid-column: span 2;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .footer-bottom-row {
            flex-direction: column;
            text-align: center;
            gap: 10px;
            padding-bottom: 10px;
          }
          .footer-trust-pills {
            justify-content: center;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .footer-links-list {
            gap: 8px;
          }
          .footer-nav-link {
            font-size: 13px;
          }
          .footer-trust-pills {
            font-size: 11px;
          }
        }
      `}</style>
    </footer>
  );
}
