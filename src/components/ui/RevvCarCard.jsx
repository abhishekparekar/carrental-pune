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

  const handleCardClick = () => navigate(`/cars/${car.id}`);

  const handleInquireClick = (e) => {
    e.stopPropagation();
    if (onEnquire) onEnquire(car);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.18 }}
        className="revv-car-card"
        onClick={handleCardClick}
      >
        {/* Car Image — full width on top */}
        <div className="revv-card-img">
          <img
            src={primaryImage}
            alt={car.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        {/* Card Body */}
        <div className="revv-card-body" style={{ flex: 1 }}>
          {/* Model year + name */}
          <span className="revv-modelyear" style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: 2 }}>
            {car.modelYear || `${car.name.split(' ').slice(-1)[0]} 2025-26`}
          </span>
          <h3 className="revv-card-title" style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 1px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {car.brand || car.name.split(' ')[0]}
          </h3>
          <p className="revv-card-subtitle" style={{ fontSize: 12, color: '#475569', margin: '0 0 0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {car.name.replace(car.brand || '', '').trim()}
          </p>

          {/* Specs bar */}
          <div className="revv-specs-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 11,
            color: '#64748B',
            paddingTop: 8,
            paddingBottom: 10,
            borderTop: '1px solid #F1F5F9',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <BsCarFront size={11} style={{ color: '#EF4444' }} />
              <span>{categoryName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FiSettings size={11} style={{ color: '#EF4444' }} />
              <span style={{ textTransform: 'capitalize' }}>{car.transmission || 'Manual'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FiUsers size={11} style={{ color: '#EF4444' }} />
              <span>{car.seats || 5} seats</span>
            </div>
          </div>

          {/* Price + CTA */}
        </div>
        <div className="revv-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div>
              <span className="revv-card-price" style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1 }}>
                {formatCurrency(car.pricePerDay || 3480)}
              </span>
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>per day</span>
            </div>

            <button
              onClick={handleInquireClick}
              className="btn btn-primary btn-sm revv-inquire-btn"
              style={{
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Inquire <FiArrowRight size={11} />
            </button>
          </div>
      </motion.div>

      <style>{`
        .revv-car-card {
          background: #FFFFFF;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: box-shadow 0.2s ease;
          height: 100%;
        }
        .revv-car-card:hover {
          box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);
        }
        .revv-card-img {
          width: 100%;
          height: 158px;
          overflow: hidden;
          background: #F1F5F9;
          flex-shrink: 0;
        }
        .revv-card-body {
          padding: 12px 14px 0;
        }
        .revv-card-footer {
          padding: 8px 14px 14px;
        }
        @media (max-width: 640px) {
          .revv-car-card { border-radius: 12px; }
          .revv-card-img { height: 115px; }
          .revv-card-body { padding: 10px 10px 0; }
          .revv-card-footer { padding: 6px 10px 10px; }
          .revv-card-title { font-size: 13.5px !important; font-weight: 800 !important; }
          .revv-card-subtitle { font-size: 11px !important; }
          .revv-card-price { font-size: 15px !important; }
          .revv-inquire-btn { padding: 5px 12px !important; font-size: 11px !important; }
          .revv-specs-bar { gap: 6px !important; font-size: 10px !important; padding-top: 6px !important; padding-bottom: 8px !important; }
          .revv-modelyear { font-size: 10px !important; }
        }
        @media (max-width: 380px) {
          .revv-card-img { height: 100px; }
          .revv-card-body { padding: 8px 8px 0; }
          .revv-card-footer { padding: 4px 8px 8px; }
          .revv-card-title { font-size: 12.5px !important; }
          .revv-card-price { font-size: 13.5px !important; }
          .revv-inquire-btn { padding: 4px 8px !important; font-size: 10px !important; }
        }
      `}</style>
    </>
  );
}
