import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

import logoImg from '../../assets/logo1.jpeg';
import { useTenant } from '../../contexts/TenantContext';

const navLinks = [
  { label: 'Home',         to: '/' },
  { label: 'Fleet',        to: '/fleet' },
  { label: 'About Us',     to: '/about' },
  { label: 'Contact',      to: '/contact' },
  { label: 'My Inquiries', to: '/my-inquiries' },
];

export default function Navbar() {
  const { settings } = useTenant();
  const [scrolled,  setScrolled]  = useState(false);
  const [hidden,    setHidden]    = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setScrolled(cur > 20);
      if (!menuOpen) {
        if (Math.abs(cur - lastScrollY) > 10) {
          setHidden(cur > 100 && cur > lastScrollY);
          lastScrollY = cur;
        }
      } else {
        setHidden(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogoClick = (e) => {
    setMenuOpen(false);
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 9999,
        transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.2s ease, box-shadow 0.2s ease',
        background: scrolled || menuOpen ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #E4E6EA' : '1px solid #EDEDF0',
        boxShadow: scrolled ? '0 4px 20px rgba(17,19,24,0.08)' : 'none',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1600,
          margin: '0 auto',
          padding: '0 clamp(16px, 2.5vw, 36px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 68,
          boxSizing: 'border-box',
        }}>

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={handleLogoClick}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <img
              src={logoImg}
              alt="SA Self Drive Cars"
              style={{
                height: 52,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 8px rgba(200,0,10,0.25))',
              }}
            />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: 14,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#C8000A' : '#334155',
                  background: isActive ? 'rgba(200,0,10,0.07)' : 'transparent',
                  border: isActive ? '1px solid rgba(200,0,10,0.18)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop CTA Buttons ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={`tel:${(settings?.phone || '+91 9270762176').replace(/\s+/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: '9999px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#1E293B',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              className="desktop-nav"
              onMouseEnter={e => { e.currentTarget.style.color = '#C8000A'; e.currentTarget.style.borderColor = 'rgba(200,0,10,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1E293B'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
            >
              <FiPhone size={13} style={{ color: '#C8000A' }} /> {settings?.phone || '+91 9270762176'}
            </a>

            <button
              className="btn btn-primary btn-sm desktop-nav"
              onClick={() => navigate('/fleet')}
              style={{ fontWeight: 800, letterSpacing: '0.3px', padding: '8px 18px', borderRadius: 'var(--radius-full)' }}
            >
              <FiCalendar size={14} /> Book Now
            </button>

            {/* Mobile Hamburger Menu Icon Button */}
            <button
              type="button"
              onClick={() => { setMenuOpen(p => !p); if (hidden) setHidden(false); }}
              aria-label="Toggle Menu"
              style={{
                width: 42, height: 42,
                borderRadius: 12,
                background: menuOpen ? 'rgba(200,0,10,0.1)' : '#F8FAFC',
                border: menuOpen ? '1px solid rgba(200,0,10,0.3)' : '1px solid #E2E8F0',
                color: menuOpen ? '#C8000A' : '#1E293B',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
              className="mobile-only"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Right-Side Slide-Over Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Dark Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
              className="mobile-only"
            />

            {/* Right Side Drawer Container */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '84%',
                maxWidth: 320,
                zIndex: 10001,
                background: '#FFFFFF',
                boxShadow: '-8px 0 36px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
              className="mobile-only"
            >
              {/* Drawer Top Branding Header */}
              <div style={{
                padding: '16px 18px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(200,0,10,0.06) 0%, #FFFFFF 100%)',
              }}>
                <img
                  src={logoImg}
                  alt="SA Self Drive Cars"
                  style={{ height: 44, width: 'auto', objectFit: 'contain' }}
                />

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    width: 34, height: 34,
                    borderRadius: '50%',
                    background: 'rgba(200,0,10,0.08)',
                    border: '1px solid rgba(200,0,10,0.2)',
                    color: '#C8000A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div style={{ flex: 1, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#C8000A', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4, paddingLeft: 4 }}>
                  Navigation
                </span>

                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) => ({
                      padding: '12px 14px',
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? '#C8000A' : '#1E293B',
                      background: isActive ? 'rgba(200,0,10,0.08)' : '#F8FAFC',
                      border: isActive ? '1px solid rgba(200,0,10,0.22)' : '1px solid #E2E8F0',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    })}
                  >
                    <span>{link.label}</span>
                    <FiChevronRight size={16} style={{ opacity: 0.6 }} />
                  </NavLink>
                ))}
              </div>

              {/* Drawer Bottom Direct Contact & Booking CTAs */}
              <div style={{
                padding: '16px 14px',
                borderTop: '1px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <a
                  href={`https://wa.me/${(settings?.whatsapp || settings?.phone || '919270762176').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(settings?.businessName || 'SA Self Drive Cars')},%20I%20want%20to%20book%20a%20car.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '11px',
                    borderRadius: 12,
                    background: '#25D366',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: 13.5,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                  }}
                >
                  <BsWhatsapp size={16} /> WhatsApp: {settings?.phone || '+91 9270762176'}
                </a>

                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 14,
                    fontWeight: 800,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 16px rgba(200,0,10,0.3)',
                  }}
                >
                  <FiCalendar size={16} /> Book a Self-Drive Car Now
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav {
          display: flex !important;
        }
        .mobile-only {
          display: none !important;
        }
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-only {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
