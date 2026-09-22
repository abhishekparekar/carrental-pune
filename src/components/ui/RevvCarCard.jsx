import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';

export default function RevvCarCard({ car, onEnquire }) {
  const navigate = useNavigate();

  if (!car) return null;

  const primaryImage = car.images && car.images.length > 0
    ? car.images[0]
    : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';

  const categoryName = (car.category || 'Hatchback').toUpperCase();
  const transmission = car.transmission 
    ? (car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1).toLowerCase())
    : 'Manual';
  const fuelType = (car.fuelType || 'Petrol').toUpperCase();

  const handleCardClick = () => {
    navigate(`/cars/${car.id}`);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    navigate(`/cars/${car.id}`);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="vk-car-card"
        onClick={handleCardClick}
      >
        {/* Full-Bleed Edge-to-Edge Car Image */}
        <div className="vk-card-img-wrap">
          {car.isPopular !== false && (
            <div className="vk-badge-popular">
              <span>🔥 POPULAR</span>
            </div>
          )}

          <div className="vk-badge-category">
            <span>{categoryName}</span>
          </div>

          <img
            src={primaryImage}
            alt={car.name}
            className="vk-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Card Body */}
        <div className="vk-card-body">
          <h3 className="vk-card-title" title={car.name}>
            {car.name}
          </h3>

          <div className="vk-card-specs">
            <span>{fuelType}</span>
            <span className="vk-dot">•</span>
            <span>{transmission}</span>
            <span className="vk-dot">•</span>
            <span>300 km/day</span>
          </div>

          {/* Pricing & CTA */}
          <div className="vk-card-footer">
            <div className="vk-price-box">
              <span className="vk-price-num">
                {formatCurrency(car.pricePerDay || 2800)}
              </span>
              <span className="vk-price-sub">per 24 hrs</span>
            </div>

            <button
              type="button"
              onClick={handleActionClick}
              className="vk-btn-details"
            >
              <span>View Details</span>
              <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        .vk-car-card {
          background: #FFFFFF;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
          border: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
          position: relative;
        }
        .vk-car-card:hover {
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
          border-color: #CBD5E1;
          transform: translateY(-4px);
        }
        .vk-card-img-wrap {
          width: 100%;
          height: 195px;
          position: relative;
          background: #0F172A;
          overflow: hidden;
        }
        .vk-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }
        .vk-car-card:hover .vk-card-img {
          transform: scale(1.05);
        }
        .vk-badge-popular {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          background: linear-gradient(135deg, #FF1E2D 0%, #C8000A 100%);
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 3px;
          box-shadow: 0 2px 8px rgba(200, 0, 10, 0.4);
          letter-spacing: 0.5px;
        }
        .vk-badge-category {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 3.5px 8px;
          border-radius: 6px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .vk-card-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          flex: 1;
          background: #FFFFFF;
        }
        .vk-card-title {
          font-size: 16px;
          font-weight: 850;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 6px;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.2s ease;
        }
        .vk-car-card:hover .vk-card-title {
          background: linear-gradient(135deg, #FF1E2D 0%, #C8000A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .vk-card-specs {
          font-size: 12.5px;
          color: #0F172A;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .vk-dot {
          color: #E50010;
          font-weight: 900;
          opacity: 0.85;
        }
        .vk-card-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
          gap: 10px;
        }
        .vk-price-box {
          display: flex;
          flex-direction: column;
        }
        .vk-price-num {
          font-size: 20px;
          font-weight: 900;
          background: linear-gradient(135deg, #FF1E2D 0%, #C8000A 60%, #990008 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
        }
        .vk-price-sub {
          font-size: 10.5px;
          background: linear-gradient(135deg, #C8000A 0%, #990008 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
        .vk-btn-details {
          background: linear-gradient(135deg, #FF1E2D 0%, #C8000A 60%, #990008 100%);
          color: #FFFFFF;
          border: none;
          outline: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 800;
          border-radius: 99px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(200, 0, 10, 0.35);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .vk-btn-details:hover {
          background: linear-gradient(135deg, #FF3340 0%, #D6000B 60%, #A80009 100%);
          box-shadow: 0 6px 18px rgba(200, 0, 10, 0.48);
          transform: translateY(-1.5px);
        }

        @media (max-width: 640px) {
          .vk-card-img-wrap {
            height: 165px;
          }
          .vk-card-body {
            padding: 12px 13px 14px;
          }
          .vk-card-title {
            font-size: 14.5px;
          }
          .vk-card-specs {
            font-size: 11.5px;
            gap: 4px;
            margin-bottom: 10px;
          }
          .vk-price-num {
            font-size: 18px;
          }
          .vk-btn-details {
            padding: 7px 12px;
            font-size: 11.5px;
          }
        }
      `}</style>
    </>
  );
}
