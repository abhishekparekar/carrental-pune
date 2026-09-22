import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CarCard({ car, onEnquire }) {
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
  );
}
