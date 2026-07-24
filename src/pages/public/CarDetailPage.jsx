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
  FiCalendar,
  FiClock,
  FiTruck,
  FiKey,
} from 'react-icons/fi';
import { BsFuelPump, BsStarFill, BsLuggage } from 'react-icons/bs';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BookingForm from '../../components/ui/BookingForm';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 70, paddingBottom: 36, flex: 1 }}>
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
              color: '#64748B',
              textDecoration: 'none',
              marginBottom: 12,
            }}
          >
            <FiArrowLeft /> Back to Fleet
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }} className="car-detail-layout">
            {/* Left Column */}
            <div>
              {/* Gallery */}
              <div style={{
                padding: 8,
                overflow: 'hidden',
                marginBottom: 20,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 320,
                  borderRadius: 12,
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
                      toast.success('Link copied to clipboard');
                    }}
                    style={{ position: 'absolute', top: 12, right: 12, borderRadius: '50%', background: '#FFFFFF' }}
                    title="Share"
                  >
                    <FiShare2 size={16} />
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: 72,
                          height: 52,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid #EF4444' : '2px solid transparent',
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

              {/* Title & Category Badge */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-accent">{car.category ? car.category.toUpperCase() : 'CAR'}</span>
                  {car.rating && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontSize: 13, fontWeight: 700 }}>
                      <BsStarFill size={13} /> {car.rating} Rating
                    </span>
                  )}
                  <span style={{ fontSize: 12, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                    <FiCheckCircle size={13} /> Available Now
                  </span>
                </div>
                <h1 style={{ fontSize: 30, margin: '0 0 6px', color: '#0F172A', fontWeight: 800 }}>{car.name}</h1>
                <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {car.description || 'Sanitized self-drive rental vehicle with unlimited kilometers & doorstep delivery.'}
                </p>
              </div>

              {/* Specs Grid */}
              <div style={{
                padding: 20,
                marginBottom: 20,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 16, marginBottom: 14, color: '#0F172A', fontWeight: 800 }}>Vehicle Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Transmission</span>
                    <strong style={{ fontSize: 14, color: '#0F172A', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <FiSettings style={{ color: '#EF4444' }} /> {car.transmission || 'Manual'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Fuel Type</span>
                    <strong style={{ fontSize: 14, color: '#0F172A', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <BsFuelPump style={{ color: '#EF4444' }} /> {car.fuelType || 'Petrol'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Seating</span>
                    <strong style={{ fontSize: 14, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <FiUsers style={{ color: '#EF4444' }} /> {car.seats || 5} Seats
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Mileage</span>
                    <strong style={{ fontSize: 14, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <FiZap style={{ color: '#EF4444' }} /> {car.mileage || '18 kmpl'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Luggage</span>
                    <strong style={{ fontSize: 14, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <BsLuggage style={{ color: '#EF4444' }} /> {car.luggageCapacity || '2 Bags'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Tariff Table */}
              <div style={{
                padding: 20,
                marginBottom: 20,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 16, marginBottom: 14, color: '#0F172A', fontWeight: 800 }}>Pricing Tariff</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                  <div style={{ padding: 14, borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Hourly Package</span>
                    <h4 style={{ fontSize: 18, margin: '4px 0 0', color: '#0F172A', fontWeight: 800 }}>{formatCurrency(car.pricePerHour || 99)} / hr</h4>
                  </div>
                  <div style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, #FFFFFF 100%)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                    <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>Daily Package</span>
                    <h4 style={{ fontSize: 20, margin: '4px 0 0', color: '#EF4444', fontWeight: 800 }}>{formatCurrency(car.pricePerDay || 2599)} / day</h4>
                  </div>
                  <div style={{ padding: 14, borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Refundable Deposit</span>
                    <h4 style={{ fontSize: 18, margin: '4px 0 0', color: '#0F172A', fontWeight: 800 }}>{formatCurrency(car.securityDeposit || 2000)}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sleek Booking CTA Card */}
            <aside style={{ alignSelf: 'start', position: 'sticky', top: 84 }}>
              <div style={{
                padding: 22,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}>
                <div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Daily Rate
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                      {formatCurrency(car.pricePerDay || 2599)}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>/ day</span>
                  </div>
                </div>

                {/* Key Benefits List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 14px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                    <FiTruck style={{ color: '#EF4444' }} size={14} /> Doorstep Delivery in 30 Mins
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                    <FiKey style={{ color: '#EF4444' }} size={14} /> Unlimited Kilometers Included
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                    <FiShield style={{ color: '#EF4444' }} size={14} /> Comprehensive Insurance Covered
                  </div>
                </div>

                {/* Glossy Book / Inquire CTA Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 15,
                    fontWeight: 800,
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 4px 18px rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <FiCalendar size={16} /> Book / Inquire Vehicle ➔
                </button>
              </div>
            </aside>
          </div>

          {/* Similar Vehicles */}
          {similarCars.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <h2 style={{ fontSize: 22, marginBottom: 18, color: '#0F172A', fontWeight: 800 }}>Similar Vehicles</h2>
              <div className="grid-3">
                {similarCars.map((sCar) => (
                  <RevvCarCard key={sCar.id} car={sCar} onEnquire={(c) => navigate(`/cars/${c.id}`)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Book ${car.name}`}
      >
        <BookingForm
          car={car}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>

      <Footer />

      <style>{`
        @media (max-width: 960px) {
          .car-detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
