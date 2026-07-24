import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone, FiCalendar } from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Fleet Catalog', to: '/fleet' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'My Inquiries', to: '/my-inquiries' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      // Never hide navbar if mobile menu drawer is open
      if (!menuOpen) {
        if (Math.abs(currentScrollY - lastScrollY) > 10) {
          if (currentScrollY > 100 && currentScrollY > lastScrollY) {
            setHidden(true);
          } else if (currentScrollY < lastScrollY) {
            setHidden(false);
          }
          lastScrollY = currentScrollY;
        }
      } else {
        setHidden(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
    if (hidden) setHidden(false);
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease, box-shadow 0.2s ease',
        background: scrolled || menuOpen ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: scrolled ? '0 4px 20px rgba(15, 23, 42, 0.08)' : 'none',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <div style={{
              width: 38,
              height: 38,
              background: 'var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 19,
              boxShadow: 'var(--shadow-accent)',
            }}>
              <BsCarFront color="#FFFFFF" />
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 21,
              color: '#0F172A',
              letterSpacing: '-0.5px',
            }}>
              Next<span style={{ color: 'var(--color-accent)' }}>Rent</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-accent)' : '#0F172A',
                  background: isActive ? 'var(--color-accent-bg)' : 'transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Buttons & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="https://wa.me/918485877633?text=Hi%20NextRent,%20I%20want%20to%20inquire%20about%20renting%20a%20self-drive%20car."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                color: '#0F172A',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
              className="desktop-nav"
            >
              <FiPhone size={13} style={{ color: 'var(--color-accent)' }} /> +91 8485877633
            </a>

            <button
              className="btn btn-primary btn-sm desktop-nav"
              onClick={() => navigate('/fleet')}
            >
              <FiCalendar /> Book Now
            </button>

            {/* Touch-optimized Mobile Toggle Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: menuOpen ? 'var(--color-accent-bg)' : '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: menuOpen ? 'var(--color-accent)' : '#0F172A',
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

      {/* Mobile Backdrop & Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                background: 'rgba(15, 23, 42, 0.5)',
                backdropFilter: 'blur(4px)',
              }}
              className="mobile-only"
            />

            {/* Slide-Down Mobile Navigation Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: 64,
                left: 0,
                right: 0,
                zIndex: 9999,
                background: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
                maxHeight: 'calc(100vh - 64px)',
                overflowY: 'auto',
              }}
              className="mobile-only"
            >
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    padding: '12px 16px',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? 'var(--color-accent)' : '#0F172A',
                    background: isActive ? 'var(--color-accent-bg)' : '#F8FAFC',
                    border: isActive ? '1px solid rgba(255, 87, 34, 0.2)' : '1px solid #F1F5F9',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  })}
                >
                  <span>{link.label}</span>
                  <span style={{ fontSize: 16 }}>➔</span>
                </NavLink>
              ))}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                <a
                  href="https://wa.me/918485877633?text=Hi%20NextRent,%20I%20want%20to%20inquire%20about%20renting%20a%20self-drive%20car."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 12,
                    background: '#25D366',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <FiPhone size={16} /> WhatsApp Inquiry (+91 8485877633)
                </a>

                <button
                  className="btn btn-primary"
                  onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
                  style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 700 }}
                >
                  Book Self-Drive Car Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 820px) { .desktop-nav { display: none !important; } }
        @media (min-width: 821px) { .mobile-only { display: none !important; } }
      `}</style>
    </>
  );
}
