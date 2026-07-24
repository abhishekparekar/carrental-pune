import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhone, FiCalendar } from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Fleet', to: '/fleet' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
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

      // Only toggle hide/show if scrolled more than 10px to prevent mobile touch bounce jitter
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
          setHidden(true);
        } else if (currentScrollY < lastScrollY) {
          setHidden(false);
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-sticky)',
        transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease, box-shadow 0.2s ease',
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: scrolled ? '0 4px 20px rgba(15, 23, 42, 0.08)' : 'none',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
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
              color: 'var(--color-text)',
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
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                  background: isActive ? 'var(--color-accent-bg)' : 'transparent',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Buttons */}
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
                color: 'var(--color-text)',
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

            {/* Mobile menu toggle */}
            <button
              className="btn-icon mobile-only"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              zIndex: 'var(--z-dropdown)',
              background: '#FFFFFF',
              borderBottom: '1px solid var(--color-border)',
              padding: '16px 20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 15,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                  background: isActive ? 'var(--color-accent-bg)' : 'transparent',
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <button
              className="btn btn-primary"
              onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
              style={{ marginTop: 8 }}
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 820px) { .desktop-nav { display: none !important; } }
        @media (min-width: 821px) { .mobile-only { display: none !important; } }
      `}</style>
    </>
  );
}
