import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiUsers, FiArrowRight } from 'react-icons/fi';
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
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="revv-car-card"
        onClick={handleCardClick}
      >
        {/* Top Header & Car Image Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
          {/* Left Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {car.modelYear || `${car.name.split(' ').slice(-1)[0]} 2025-26`}
            </span>
            <h3 className="car-card-title" style={{ fontSize: 19, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {car.brand || car.name.split(' ')[0]}
            </h3>
            <p style={{ fontSize: 12, color: '#475569', margin: '2px 0 0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {car.name.replace(car.brand || '', '').trim()}
            </p>
          </div>

          {/* Right Car Image Container */}
          <div className="car-card-img-box" style={{
            width: 110,
            height: 72,
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
          gap: 12,
          fontSize: 11,
          color: '#64748B',
          marginBottom: 14,
          paddingTop: 8,
          borderTop: '1px solid #F1F5F9',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BsCarFront size={12} style={{ color: 'var(--color-accent)' }} />
            <span>{categoryName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiSettings size={12} style={{ color: 'var(--color-accent)' }} />
            <span style={{ textTransform: 'capitalize' }}>{car.transmission || 'Manual'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiUsers size={12} style={{ color: 'var(--color-accent)' }} />
            <span>{car.seats || 5} seats</span>
          </div>
        </div>

        {/* Bottom Pricing & Inquire CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <span className="car-card-price" style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1 }}>
              {formatCurrency(car.pricePerDay || 3480)}
            </span>
            <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
              per day
            </span>
          </div>

          {/* Glossy Inquire Button */}
          <button
            onClick={handleInquireClick}
            className="btn btn-primary btn-sm"
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-accent)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Inquire <FiArrowRight size={12} />
          </button>
        </div>
      </motion.div>

      <style>{`
        .revv-car-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          position: relative;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .revv-car-card {
            padding: 14px 14px !important;
          }
          .car-card-img-box {
            width: 90px !important;
            height: 60px !important;
          }
          .car-card-title {
            font-size: 16px !important;
          }
          .car-card-price {
            font-size: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
