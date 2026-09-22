import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

import logoImg from '../../assets/logo1.png';
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
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.25s ease, box-shadow 0.25s ease',
        background: scrolled || menuOpen 
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)' 
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.90) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(226, 232, 240, 0.5)',
        boxShadow: scrolled ? '0 4px 24px rgba(15, 23, 42, 0.08)' : '0 2px 10px rgba(15, 23, 42, 0.03)',
      }}>
        {/* Top Accent Gradient Line */}
        <div style={{
          height: 3,
          width: '100%',
          background: 'linear-gradient(90deg, #E50010 0%, #C8000A 50%, #8C909A 100%)',
        }} />

        <div style={{
          width: '100%',
          maxWidth: 1600,
          margin: '0 auto',
          padding: '0 clamp(16px, 2.5vw, 36px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 69,
          boxSizing: 'border-box',
        }}>

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={handleLogoClick}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', transition: 'transform 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={logoImg}
              alt="SA Self Drive Cars"
              style={{
                height: 52,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
              }}
            />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: 13.5,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#C8000A' : '#334155',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(200,0,10,0.10) 0%, rgba(200,0,10,0.04) 100%)' 
                    : 'transparent',
                  border: isActive ? '1px solid rgba(200,0,10,0.22)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(200,0,10,0.10)' : 'none',
                  transition: 'all 0.18s ease',
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop CTA Buttons ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="btn btn-primary btn-sm desktop-nav"
              onClick={() => navigate('/fleet')}
              style={{ fontWeight: 800, letterSpacing: '0.3px', padding: '8px 20px', borderRadius: 'var(--radius-full)' }}
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
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '-8px 0 36px rgba(15, 23, 42, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                borderLeft: '1px solid rgba(226, 232, 240, 0.8)',
              }}
              className="mobile-only"
            >
              {/* Top Accent Gradient Line Matching Navbar */}
              <div style={{
                height: 3,
                width: '100%',
                background: 'linear-gradient(90deg, #E50010 0%, #C8000A 50%, #8C909A 100%)',
              }} />

              {/* Drawer Top Branding Header */}
              <div style={{
                padding: '16px 18px',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)',
              }}>
                <img
                  src={logoImg}
                  alt="SA Self Drive Cars"
                  style={{ height: 46, width: 'auto', objectFit: 'contain' }}
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
                  aria-label="Close Menu"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div style={{ flex: 1, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#C8000A', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2, paddingLeft: 4 }}>
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
                      fontSize: 14.5,
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? '#C8000A' : '#1E293B',
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(200,0,10,0.10) 0%, rgba(200,0,10,0.04) 100%)' 
                        : '#FFFFFF',
                      border: isActive ? '1px solid rgba(200,0,10,0.22)' : '1px solid #E2E8F0',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 2px 8px rgba(200,0,10,0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                    })}
                  >
                    <span>{link.label}</span>
                    <FiChevronRight size={16} style={{ opacity: 0.6 }} />
                  </NavLink>
                ))}
              </div>

              {/* Drawer Bottom Quick Action */}
              <div style={{
                padding: '16px 14px',
                borderTop: '1px solid rgba(226, 232, 240, 0.8)',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <a
                  href={`tel:${(settings?.phone || '+91 9270762176').replace(/\s+/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px',
                    borderRadius: 12,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <FiPhone size={14} style={{ color: '#C8000A' }} /> Call: {settings?.phone || '+91 9270762176'}
                </a>

                <a
                  href={`https://wa.me/${(settings?.whatsapp || settings?.phone || '919270762176').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(settings?.businessName || 'SA Self Drive Cars')},%20I%20want%20to%20book%20a%20car.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  <BsWhatsapp size={15} /> WhatsApp Instant
                </a>

                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: 13.5,
                    fontWeight: 800,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <FiCalendar size={15} /> View Fleet & Book
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
