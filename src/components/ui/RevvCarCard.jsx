import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiUsers, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';
import { formatCurrency } from '../../utils/formatCurrency';

export default function RevvCarCard({ car, onEnquire }) {
  const navigate = useNavigate();

  if (!car) return null;

  const primaryImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';

  const categoryName = (car.category || 'Hatchback').toUpperCase();

  const handleCardClick = () => {
    navigate(`/cars/${car.id}`);
  };

  const handleInquireClick = (e) => {
    e.stopPropagation();
    if (onEnquire) {
      onEnquire(car);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '20px 22px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={handleCardClick}
    >
      {/* Top Header & Car Image Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        {/* Left Text */}
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 2 }}>
            {car.modelYear || `${car.name.split(' ').slice(-1)[0]} 2025-26`}
          </span>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
            {car.brand || car.name.split(' ')[0]}
          </h3>
          <p style={{ fontSize: 13, color: '#475569', margin: '2px 0 0', fontWeight: 600 }}>
            {car.name.replace(car.brand || '', '').trim()}
          </p>
        </div>

        {/* Right Car Image Container */}
        <div style={{
          width: 130,
          height: 80,
          flexShrink: 0,
          borderRadius: 10,
          overflow: 'hidden',
          background: '#F8FAFC',
          border: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={primaryImage}
            alt={car.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>
      </div>

      {/* Middle Specs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontSize: 12,
        color: '#64748B',
        marginBottom: 16,
        paddingTop: 10,
        borderTop: '1px solid #F1F5F9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <BsCarFront size={13} style={{ color: 'var(--color-accent)' }} />
          <span>{categoryName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FiSettings size={13} style={{ color: 'var(--color-accent)' }} />
          <span style={{ textTransform: 'capitalize' }}>{car.transmission || 'Manual'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FiUsers size={13} style={{ color: 'var(--color-accent)' }} />
          <span>{car.seats || 5} seats</span>
        </div>
      </div>

      {/* Bottom Pricing & Inquire CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1 }}>
            {formatCurrency(car.pricePerDay || 3480)}
          </span>
          <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>
            per day
          </span>
        </div>

        {/* Glossy Inquire Button */}
        <button
          onClick={handleInquireClick}
          className="btn btn-primary btn-sm"
          style={{
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          Inquire <FiArrowRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}
