import { Link } from 'react-router-dom';
import { BsCarFront, BsFacebook, BsInstagram, BsTwitterX, BsYoutube } from 'react-icons/bs';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const footerLinks = {
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Fleet', to: '/fleet' },
    { label: 'Contact', to: '/contact' },
  ],
  Services: [
    { label: 'Daily Rental', to: '/fleet' },
    { label: 'Weekly Rental', to: '/fleet' },
    { label: 'Monthly Subscriptions', to: '/fleet' },
    { label: 'Doorstep Delivery', to: '/fleet' },
  ],
  Support: [
    { label: 'FAQ & Help', to: '/contact' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Cancellation Policy', to: '#' },
  ],
};

const socials = [
  { icon: <BsFacebook />, href: '#', label: 'Facebook' },
  { icon: <BsInstagram />, href: '#', label: 'Instagram' },
  { icon: <BsTwitterX />, href: '#', label: 'Twitter/X' },
  { icon: <BsYoutube />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0F172A 0%, #090D16 100%)',
      borderTop: '1px solid #1E293B',
      padding: '52px 0 24px',
      marginTop: 'auto',
      color: '#FFFFFF',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 36,
          marginBottom: 36,
        }}>
          {/* Brand Column */}
          <div>
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              marginBottom: 16,
            }}>
              <div style={{
                width: 36,
                height: 36,
                background: 'var(--color-accent)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                boxShadow: 'var(--shadow-accent)',
              }}>
                <BsCarFront color="#FFFFFF" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: 21,
                color: '#FFFFFF',
                letterSpacing: '-0.5px',
              }}>
                Next<span style={{ color: 'var(--color-accent)' }}>Rent</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginBottom: 16, maxWidth: 220 }}>
              Premium self-drive car rental service with doorstep delivery & unlimited kilometers across India.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#CBD5E1',
                    fontSize: 14,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}>{group}</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      style={{
                        fontSize: 13,
                        color: '#94A3B8',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>Contact</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: <FiPhone />, text: '+91 8485877633', href: 'https://wa.me/918485877633' },
                { icon: <FiMail />, text: 'hello@nextrent.com', href: 'mailto:hello@nextrent.com' },
                { icon: <FiMapPin />, text: 'BKC, Mumbai, MH 400051', href: '#' },
              ].map(item => (
                <li key={item.text}>
                  <a
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: '#94A3B8',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ color: 'var(--color-accent)' }}>{item.icon}</span>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ height: 1, background: '#1E293B', border: 'none', margin: '0 0 20px' }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <p style={{ fontSize: 12, color: '#64748B' }}>
            © {new Date().getFullYear()} NextRent Self-Drive Rentals. All rights reserved.
          </p>
          <Link
            to="/admin/login"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-accent)',
              textDecoration: 'none',
            }}
          >
            Admin Portal CRM →
          </Link>
        </div>
      </div>
    </footer>
  );
}
