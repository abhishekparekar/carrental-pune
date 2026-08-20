import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiUsers, FiArrowRight, FiClock } from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';
import { formatCurrency } from '../../utils/formatCurrency';

export default function RevvCarCard({ car, onEnquire }) {
  const navigate = useNavigate();

  if (!car) return null;

  const primaryImage = car.images && car.images.length > 0
    ? car.images[0]
    : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';

  const categoryName = (car.category || 'Hatchback').toUpperCase();
  const seatsNum = car.seats || 5;
  const extraKm = car.extraKmRate || (seatsNum === 7 ? 7 : 6);
  const extraTime = car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200);

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
        {/* Car Image Container with Ambient Studio Framing */}
        <div className="revv-card-img" style={{ position: 'relative', background: '#0F172A', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {car.isPopular && (
            <div style={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 3,
              background: 'linear-gradient(135deg, #C8000A 0%, #990000 100%)',
              color: '#FFFFFF',
              fontSize: 9.5,
              fontWeight: 900,
              padding: '3px 8px',
              borderRadius: 99,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              boxShadow: '0 2px 10px rgba(200, 0, 10, 0.4)',
              letterSpacing: '0.5px',
            }}>
              <span>🔥 POPULAR</span>
            </div>
          )}

          {/* Ambient Blurred Fill */}
          <img
            src={primaryImage}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(16px) brightness(0.6)',
              transform: 'scale(1.2)',
              zIndex: 1,
            }}
          />

          {/* 100% Complete Uncropped Sharp Car Photo */}
          <img
            src={primaryImage}
            alt={car.name}
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              filter: 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.4))',
              transition: 'transform 0.3s ease',
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';
            }}
          />

          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: 9.5,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 99,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span>+₹{extraKm}/km</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="revv-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
              <span className="revv-modelyear" style={{ fontSize: 11, color: '#475569', fontWeight: 700 }}>
                {car.modelYear || `${car.name.split(' ').slice(-1)[0]} 2025`}
              </span>
              <span className="revv-card-subtitle" style={{ fontSize: 11, color: '#1E293B', fontWeight: 800, margin: 0 }}>
                {car.brand || car.name.split(' ')[0]} • {car.fuelType ? car.fuelType.toUpperCase() : 'PETROL'}
              </span>
            </div>
            
            <h3 className="revv-card-title" style={{ fontSize: 15.5, fontWeight: 900, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {car.name}
            </h3>
          </div>

          {/* Specs bar */}
          <div className="revv-specs-bar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            fontSize: 11,
            fontWeight: 700,
            color: '#334155',
            paddingTop: 5,
            paddingBottom: 6,
            borderTop: '1px solid #F1F5F9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <BsCarFront size={12} style={{ color: '#C8000A' }} />
              <span>{categoryName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FiSettings size={12} style={{ color: '#C8000A' }} />
              <span style={{ textTransform: 'capitalize' }}>{car.transmission || 'Manual'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FiUsers size={12} style={{ color: '#C8000A' }} />
              <span>{seatsNum} Seats</span>
            </div>
          </div>
        </div>

        {/* Card Footer: Pricing & Action */}
        <div className="revv-card-footer" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #F1F5F9',
          gap: 6,
        }}>
          <div>
            <span style={{ fontSize: 9.5, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', lineHeight: 1 }}>
              Daily Tariff
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span className="revv-card-price" style={{ fontSize: 17, fontWeight: 900, color: '#C8000A', lineHeight: 1.2 }}>
                {formatCurrency(car.pricePerDay || 2300)}
              </span>
              <span style={{ fontSize: 11, color: '#475569', fontWeight: 700 }}>/day</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInquireClick}
            className="btn btn-primary btn-sm revv-inquire-btn"
            style={{
              padding: '6px 14px',
              fontSize: 11.5,
              fontWeight: 800,
              borderRadius: 'var(--radius-full)',
              background: '#C8000A',
              borderColor: '#C8000A',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 8px rgba(200, 0, 10, 0.30)',
            }}
          >
            <span>Book Now</span>
            <FiArrowRight size={11} />
          </button>
        </div>
      </motion.div>

      <style>{`
        .revv-car-card {
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.05);
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.2s ease;
          height: 100%;
        }
        .revv-car-card:hover {
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
          border-color: #CBD5E1;
        }
        .revv-car-card:hover .revv-card-img img {
          transform: scale(1.02);
        }
        .revv-card-img {
          width: 100%;
          aspect-ratio: 16 / 9.5;
          height: clamp(140px, 13vw, 175px);
          overflow: hidden;
          background: #0F172A;
          flex-shrink: 0;
          position: relative;
        }
        .revv-card-body {
          padding: 8px 10px 0;
        }
        .revv-card-footer {
          padding: 5px 10px 8px;
        }
        @media (max-width: 640px) {
          .revv-car-card { border-radius: 10px; }
          .revv-card-img { height: clamp(105px, 28vw, 135px); aspect-ratio: 16 / 10; }
          .revv-card-body { padding: 6px 7px 0; }
          .revv-card-footer { padding: 4px 7px 6px; }
          .revv-card-title { font-size: 12.5px !important; font-weight: 800 !important; }
          .revv-card-subtitle { font-size: 9.5px !important; }
          .revv-specs-bar { font-size: 9px !important; padding-top: 3px !important; padding-bottom: 3px !important; }
          .revv-specs-bar svg { width: 8.5px !important; height: 8.5px !important; }
          .revv-card-price { font-size: 13.5px !important; }
          .revv-inquire-btn { padding: 3px 8px !important; font-size: 9.5px !important; border-radius: 99px !important; }
          .revv-modelyear { font-size: 8.5px !important; }
        }
      `}</style>
    </>
  );
}
