import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiSettings,
  FiZap,
  FiCheckCircle,
  FiShield,
  FiArrowLeft,
  FiShare2,
} from 'react-icons/fi';
import { BsFuelPump, BsStarFill, BsLuggage } from 'react-icons/bs';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BookingForm from '../../components/ui/BookingForm';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';

import { useTenant } from '../../contexts/TenantContext';
import { getCar, getCars } from '../../firebase/firestore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CarDetailPage() {
  const { carId } = useParams();
  const { tenantId } = useTenant();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    getCar(tenantId, carId)
      .then((data) => {
        setCar(data);
        if (data) {
          getCars(tenantId).then((all) => {
            const filtered = all.filter((c) => c.id !== carId && c.category === data.category);
            setSimilarCars(filtered.slice(0, 3));
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching car:', err);
        toast.error('Failed to load car details');
      })
      .finally(() => setLoading(false));
  }, [tenantId, carId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
        <Navbar />
        <main style={{ paddingTop: 90, flex: 1 }} className="container">
          <CarSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
        <Navbar />
        <main style={{ paddingTop: 120, flex: 1, textAlign: 'center' }} className="container">
          <h2>Car Not Found</h2>
          <p style={{ color: 'var(--color-text-2)', marginBottom: 20 }}>
            The requested car listing does not exist or has been removed.
          </p>
          <Link to="/fleet" className="btn btn-primary">
            Browse All Fleet
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = car.images && car.images.length > 0
    ? car.images
    : ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ paddingTop: 70, paddingBottom: 28, flex: 1 }}>
        <div className="container">
          {/* Back button */}
          <Link
            to="/fleet"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-text-2)',
              textDecoration: 'none',
              marginBottom: 12,
            }}
          >
            <FiArrowLeft /> Back to Fleet
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }} className="car-detail-layout">
            {/* Left Column */}
            <div>
              {/* Gallery */}
              <div className="glass-card" style={{ padding: 8, overflow: 'hidden', marginBottom: 20, background: '#FFFFFF' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 310,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: '#F1F5F9',
                  marginBottom: 8,
                }}>
                  <img
                    src={images[selectedImageIndex]}
                    alt={car.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    className="btn-icon"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied');
                    }}
                    style={{ position: 'absolute', top: 12, right: 12 }}
                    title="Share"
                  >
                    <FiShare2 />
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: 72,
                          height: 52,
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid var(--color-accent)' : '2px solid transparent',
                          cursor: 'pointer',
                          padding: 0,
                          flexShrink: 0,
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Brand */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className="badge badge-accent">{car.category ? car.category.toUpperCase() : 'CAR'}</span>
                  {car.rating && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D97706', fontSize: 13, fontWeight: 700 }}>
                      <BsStarFill /> {car.rating} Rating
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <FiCheckCircle /> Available Now
                  </span>
                </div>
                <h1 style={{ fontSize: 32, margin: '0 0 8px', color: 'var(--color-text)' }}>{car.name}</h1>
                <p style={{ fontSize: 14, color: 'var(--color-text-2)' }}>{car.description || 'Sanitized self-drive rental vehicle with unlimited kilometers.'}</p>
              </div>

              {/* Specs Grid */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 24, background: '#FFFFFF' }}>
                <h3 style={{ fontSize: 16, marginBottom: 16, color: 'var(--color-text)' }}>Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Transmission</span>
                    <strong style={{ fontSize: 14, color: 'var(--color-text)', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiSettings style={{ color: 'var(--color-accent)' }} /> {car.transmission || 'Manual'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Fuel Type</span>
                    <strong style={{ fontSize: 14, color: 'var(--color-text)', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <BsFuelPump style={{ color: 'var(--color-accent)' }} /> {car.fuelType || 'Petrol'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Capacity</span>
                    <strong style={{ fontSize: 14, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiUsers style={{ color: 'var(--color-accent)' }} /> {car.seats || 5} People
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Mileage</span>
                    <strong style={{ fontSize: 14, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiZap style={{ color: 'var(--color-accent)' }} /> {car.mileage || '18 kmpl'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase', fontWeight: 700 }}>Luggage</span>
                    <strong style={{ fontSize: 14, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <BsLuggage style={{ color: 'var(--color-accent)' }} /> {car.luggageCapacity || '2-3 Bags'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Tariff Table */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 24, background: '#FFFFFF' }}>
                <h3 style={{ fontSize: 16, marginBottom: 14, color: 'var(--color-text)' }}>Pricing Tariff</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>Hourly Rate</span>
                    <h4 style={{ fontSize: 18, margin: '2px 0 0', color: 'var(--color-text)' }}>{formatCurrency(car.pricePerHour || 99)} / hr</h4>
                  </div>
                  <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-bg)', border: '1px solid rgba(255,87,34,0.2)' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 700 }}>Daily Package</span>
                    <h4 style={{ fontSize: 20, margin: '2px 0 0', color: 'var(--color-accent)', fontWeight: 800 }}>{formatCurrency(car.pricePerDay || 1499)} / day</h4>
                  </div>
                  <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>Refundable Deposit</span>
                    <h4 style={{ fontSize: 18, margin: '2px 0 0', color: 'var(--color-text)' }}>{formatCurrency(car.securityDeposit || 2000)}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Form */}
            <aside style={{ alignSelf: 'start', position: 'sticky', top: 80 }}>
              <div className="glass-card" style={{ padding: 20, background: '#FFFFFF', boxShadow: 'var(--shadow-xl)' }}>
                <h3 style={{ fontSize: 18, marginBottom: 4, color: 'var(--color-text)' }}>Book This Vehicle</h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-2)', marginBottom: 16 }}>
                  Submit an inquiry for instant doorstep delivery scheduling.
                </p>
                <BookingForm car={car} />
              </div>
            </aside>
          </div>

          {/* Similar Vehicles */}
          {similarCars.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 22, marginBottom: 20, color: 'var(--color-text)', fontWeight: 800 }}>Similar Vehicles</h2>
              <div className="grid-3">
                {similarCars.map((sCar) => (
                  <RevvCarCard key={sCar.id} car={sCar} onEnquire={(c) => navigate(`/cars/${c.id}`)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 960px) {
          .car-detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
