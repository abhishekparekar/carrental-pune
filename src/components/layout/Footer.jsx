import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitterX, BsYoutube, BsWhatsapp } from 'react-icons/bs';
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import logoImg from '../../assets/logo1.jpeg';
import { useTenant } from '../../contexts/TenantContext';

export default function Footer() {
  const { settings } = useTenant();

  const quickLinks = [
    { label: 'Home', to: '/' },
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
    { icon: <BsFacebook />, href: settings?.facebook || '#', label: 'Facebook' },
    { icon: <BsInstagram />, href: settings?.instagram || '#', label: 'Instagram' },
    { icon: <BsTwitterX />, href: settings?.twitter || '#', label: 'Twitter' },
    { icon: <BsYoutube />, href: settings?.youtube || '#', label: 'YouTube' },
  ];

  const rawPhone = settings?.phone || '+91 9270762176';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const rawWhatsapp = settings?.whatsapp || cleanPhone || '919270762176';
  const whatsappNumber = rawWhatsapp.startsWith('91') ? rawWhatsapp : `91${rawWhatsapp}`;

  return (
    <footer className="footer-root" style={{
      background: 'linear-gradient(180deg, #0F172A 0%, #06080D 100%)',
      marginTop: 'auto',
      color: '#F1F5F9',
      borderTop: '1px solid rgba(200, 0, 10, 0.25)',
    }}>
      {/* Top Gradient Line */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, #E50010 0%, #C8000A 50%, #800006 100%)',
        width: '100%',
      }} />

      <div style={{ padding: '20px 0 12px' }}>
        <div className="container">
          
          <div className="footer-compact-grid">

            {/* 1. Brand & Identity */}
            <div className="footer-brand-box">
              <div className="footer-brand-top">
                <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                  <div style={{
                    background: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: 6,
                    display: 'inline-block',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}>
                    <img
                      src={logoImg}
                      alt={settings?.businessName || 'SA Self Drive Cars'}
                      style={{ height: 28, width: 'auto', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                </Link>

                <div className="footer-socials-inline">
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

              <p className="footer-tagline">
                {settings?.tagline || 'Pune’s premier self-drive car rental with 300 km daily limit & 30-min doorstep delivery.'}
              </p>
            </div>

            {/* 2. Quick Navigation */}
            <div className="footer-links-group">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links-list">
                {quickLinks.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="footer-nav-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Fleet Categories */}
            <div className="footer-links-group">
              <h4 className="footer-col-title">Fleet Categories</h4>
              <ul className="footer-links-list">
                {categories.map(c => (
                  <li key={c.label}>
                    <Link to={c.to} className="footer-nav-link">{c.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Contact & WhatsApp Booking */}
            <div className="footer-contact-box">
              <h4 className="footer-col-title">Instant Booking & Help</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
                <a href={`tel:${rawPhone.replace(/\s+/g, '')}`} className="footer-contact-item">
                  <FiPhone size={12} color="#E50010" />
                  <span>{rawPhone}</span>
                </a>
                <a href={`mailto:${settings?.email || 'info@saselfdrivecars.com'}`} className="footer-contact-item">
                  <FiMail size={12} color="#E50010" />
                  <span>{settings?.email || 'info@saselfdrivecars.com'}</span>
                </a>
                <span className="footer-contact-item" style={{ cursor: 'default' }}>
                  <FiMapPin size={12} color="#E50010" />
                  <span>{settings?.address || 'Pune & PCMC, Maharashtra'}</span>
                </span>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(settings?.businessName || 'SA Self Drive Cars')},%20I%20want%20to%20inquire%20about%20booking%20a%20car.`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-whatsapp-btn"
              >
                <BsWhatsapp size={13} /> Book on WhatsApp
              </a>
            </div>

          </div>

          {/* Bottom Divider & Copyright Bar */}
          <div style={{
            height: 1,
            background: 'rgba(255, 255, 255, 0.06)',
            margin: '12px 0 8px',
          }} />

          <div className="footer-bottom-bar">
            <p style={{ fontSize: 11, color: '#64748B', margin: 0, fontWeight: 500 }}>
              © {new Date().getFullYear()} <strong style={{ color: '#CBD5E1' }}>{settings?.businessName || 'SA Self Drive Cars'}</strong>. All rights reserved.
            </p>
            <div className="footer-bottom-badges">
              <span><FiCheckCircle color="#22C55E" size={11} /> 100% Insured</span>
              <span>•</span>
              <span>⚡ 300 KM/Day</span>
              <span>•</span>
              <span>🏠 Doorstep Drop</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .footer-compact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.85fr) minmax(0, 0.85fr) minmax(0, 1.3fr);
          gap: clamp(12px, 1.8vw, 24px);
          align-items: start;
        }
        .footer-brand-top {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          margin-bottom: 6px;
        }
        .footer-tagline {
          font-size: 11.5px;
          color: #94A3B8;
          line-height: 1.4;
          margin: 0;
          max-width: 280px;
        }
        .footer-socials-inline {
          display: flex;
          gap: 5px;
        }
        .footer-social-btn {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #CBD5E1;
          font-size: 11.5px;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .footer-social-btn:hover {
          background: #C8000A;
          color: #FFFFFF;
          border-color: #C8000A;
        }
        .footer-col-title {
          font-size: 10px;
          font-weight: 800;
          color: #FF3333;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin: 0 0 6px;
        }
        .footer-links-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-nav-link {
          font-size: 11.5px;
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.15s ease;
          display: inline-block;
          line-height: 1.3;
        }
        .footer-nav-link:hover {
          color: #FFFFFF;
        }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #CBD5E1;
          text-decoration: none;
          line-height: 1.3;
        }
        .footer-contact-item:hover {
          color: #FFFFFF;
        }
        .footer-whatsapp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 6px;
          background: linear-gradient(135deg, #25D366 0%, #1EAA52 100%);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(37,211,102,0.25);
          transition: all 0.15s ease;
        }
        .footer-whatsapp-btn:hover {
          transform: translateY(-1px);
        }
        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .footer-bottom-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          color: #64748B;
        }
        @media (max-width: 900px) {
          .footer-compact-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px 14px;
          }
          .footer-brand-box {
            grid-column: span 2;
          }
          .footer-contact-box {
            grid-column: span 2;
          }
          .footer-whatsapp-btn {
            display: flex !important;
            width: 100%;
          }
          .footer-bottom-bar {
            justify-content: center;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-compact-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px 12px;
          }
          .footer-brand-box {
            grid-column: span 2;
            padding-bottom: 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .footer-contact-box {
            grid-column: span 2;
            padding-top: 4px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }
          .footer-bottom-badges {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}
