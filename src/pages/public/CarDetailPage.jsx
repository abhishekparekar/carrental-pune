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
import { BsFuelPump, BsStarFill, BsLuggage, BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BookingForm from '../../components/ui/BookingForm';
import TermsAndConditions from '../../components/ui/TermsAndConditions';
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

      <main style={{ paddingTop: 'clamp(68px, 8vw, 82px)', paddingBottom: 40, flex: 1 }}>
        <div className="container">
          
          {/* Top Bar: Navigation & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <Link
              to="/fleet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                fontWeight: 700,
                color: '#C8000A',
                textDecoration: 'none',
                background: 'rgba(200, 0, 10, 0.06)',
                padding: '6px 14px',
                borderRadius: 99,
                border: '1px solid rgba(200, 0, 10, 0.15)',
                transition: 'all 0.15s ease',
              }}
            >
              <FiArrowLeft /> Back to Fleet
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-accent" style={{ background: '#C8000A', color: '#FFFFFF', fontWeight: 800, fontSize: 11 }}>
                {car.category ? car.category.toUpperCase() : 'CAR'}
              </span>
              {car.rating && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#D97706', fontSize: 11.5, fontWeight: 800, background: '#FEF3C7', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(217,119,6,0.2)' }}>
                  <BsStarFill size={11} /> {car.rating} Rating
                </span>
              )}
              <span style={{ fontSize: 11.5, color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 800, background: '#DCFCE7', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(22,163,74,0.2)' }}>
                <FiCheckCircle size={11} /> Available Now
              </span>
            </div>
          </div>

          {/* Car Name Title Header */}
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', margin: '0 0 4px', color: '#0F172A', fontWeight: 900, lineHeight: 1.2 }}>
              {car.name}
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              {car.description || 'Sanitized self-drive rental vehicle with 300 km daily limit & doorstep delivery in Pune & PCMC.'}
            </p>
          </div>

          {/* Main 2-Column Balanced Grid */}
          <div className="car-detail-layout">
            
            {/* Left Column: Photo Gallery + Specs + Tariffs + Terms */}
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Photo Gallery Card */}
              <div style={{
                padding: 6,
                overflow: 'hidden',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#0B0F17',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: images.length > 1 ? 6 : 0,
                  }}
                  className="car-gallery-main"
                >
                  {/* Ambient Background Fill */}
                  <img
                    src={images[selectedImageIndex]}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'blur(20px) brightness(0.55)',
                      transform: 'scale(1.2)',
                      zIndex: 1,
                    }}
                  />

                  {/* Sharp 100% Full Uncropped Car Photo */}
                  <img
                    src={images[selectedImageIndex]}
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
                      filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.45))',
                    }}
                  />
                  <button
                    className="btn-icon"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard');
                    }}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                    title="Share Car Link"
                  >
                    <FiShare2 size={15} />
                  </button>
                </div>

                {/* Thumbnails Strip */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '2px 0 4px', scrollbarWidth: 'none' }}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: 64,
                          height: 44,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid #C8000A' : '2px solid transparent',
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

              {/* Vehicle Specifications */}
              <div style={{
                padding: '14px 16px',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 14, marginBottom: 10, color: '#0F172A', fontWeight: 800 }}>
                  Key Vehicle Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Transmission</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiSettings style={{ color: '#C8000A', flexShrink: 0 }} size={12} /> {car.transmission || 'Manual'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Fuel Type</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <BsFuelPump style={{ color: '#C8000A', flexShrink: 0 }} size={12} /> {car.fuelType || 'Petrol'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Seating</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiUsers style={{ color: '#C8000A', flexShrink: 0 }} size={12} /> {car.seats || 5} Seats
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Mileage</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiZap style={{ color: '#C8000A', flexShrink: 0 }} size={12} /> {car.mileage || '18 kmpl'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Luggage</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <BsLuggage style={{ color: '#C8000A', flexShrink: 0 }} size={12} /> {car.luggageCapacity || '2 Bags'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Pricing Tariff Card */}
              <div style={{
                padding: '14px 16px',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 14, marginBottom: 10, color: '#0F172A', fontWeight: 800 }}>
                  Rental Tariff & Extra Surcharges
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 8 }}>
                  <div style={{ padding: 10, borderRadius: 10, background: 'linear-gradient(135deg, rgba(200, 0, 10, 0.06) 0%, #FFFFFF 100%)', border: '1px solid rgba(200, 0, 10, 0.22)' }}>
                    <span style={{ fontSize: 10.5, color: '#C8000A', fontWeight: 800 }}>Daily Rate (24h)</span>
                    <h4 style={{ fontSize: 16, margin: '2px 0 0', color: '#C8000A', fontWeight: 900 }}>{formatCurrency(car.pricePerDay || 2300)} / d</h4>
                  </div>
                  <div style={{ padding: 10, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Extra KM</span>
                    <h4 style={{ fontSize: 14, margin: '2px 0 0', color: '#111318', fontWeight: 800 }}>
                      ₹{car.extraKmRate || (car.seats === 7 ? 7 : 6)} / km
                    </h4>
                  </div>
                  <div style={{ padding: 10, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Overtime</span>
                    <h4 style={{ fontSize: 14, margin: '2px 0 0', color: '#111318', fontWeight: 800 }}>
                      ₹{car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200)} / hr
                    </h4>
                  </div>
                  <div style={{ padding: 10, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Security Deposit</span>
                    <h4 style={{ fontSize: 14, margin: '2px 0 0', color: '#111318', fontWeight: 800 }}>{formatCurrency(car.securityDeposit || 2000)}</h4>
                  </div>
                </div>
              </div>

              {/* Rental Terms & Conditions */}
              <div>
                <TermsAndConditions expandable={true} defaultOpen={false} />
              </div>
            </div>

            {/* Right Column: Direct Embedded Booking Card (Zero Gap) */}
            <aside className="car-detail-sidebar">
              <div style={{
                background: '#FFFFFF',
                borderRadius: 18,
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                padding: '18px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {/* Top Pricing Banner */}
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(200, 0, 10, 0.06) 0%, rgba(255, 255, 255, 1) 100%)',
                  border: '1px solid rgba(200, 0, 10, 0.20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
                      Daily Rental Rate
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: '#C8000A', lineHeight: 1 }}>
                        {formatCurrency(car.pricePerDay || 2300)}
                      </span>
                      <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>/ 24 hrs</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, background: '#DCFCE7', color: '#16A34A', fontWeight: 800, padding: '3px 8px', borderRadius: 99, display: 'inline-block' }}>
                      ✓ 300 KM Included
                    </span>
                    <span style={{ fontSize: 10.5, color: '#64748B', display: 'block', marginTop: 3 }}>
                      Doorstep in 30 Mins
                    </span>
                  </div>
                </div>

                {/* Direct Embedded Booking Form */}
                <div style={{ marginTop: 2 }}>
                  <BookingForm car={car} onSuccess={() => toast.success(`Booking request for ${car.name} received!`)} />
                </div>

                {/* Instant WhatsApp Help Button */}
                <a
                  href={`https://wa.me/919270762176?text=Hi%20SA%20Self%20Drive%20Cars,%20I%20want%20to%20inquire%20about%20booking%20${encodeURIComponent(car.name)}%20(${formatCurrency(car.pricePerDay || 2300)}/day).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '9px 14px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #25D366 0%, #1EAA52 100%)',
                    color: '#FFFFFF',
                    fontSize: 12.5,
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <BsWhatsapp size={15} /> WhatsApp Instant Booking
                </a>
              </div>
            </aside>

          </div>

          {/* Similar Vehicles Grid */}
          {similarCars.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <div style={{ marginBottom: 12 }}>
                <span className="section-label-red">More Options</span>
                <h2 style={{ fontSize: 18, margin: '4px 0 0', color: '#111318', fontWeight: 800 }}>Similar Vehicles in Fleet</h2>
              </div>
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
        .car-detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(340px, 420px);
          gap: clamp(16px, 2.5vw, 28px);
          align-items: start;
        }
        .car-detail-sidebar {
          position: sticky;
          top: 80px;
        }
        .car-gallery-main {
          height: clamp(240px, 26vw, 360px);
        }
        @media (max-width: 1024px) {
          .car-detail-layout {
            grid-template-columns: 1fr !important;
            gap: 20px;
          }
          .car-detail-sidebar {
            position: static !important;
          }
          .car-gallery-main {
            height: clamp(220px, 45vw, 320px);
          }
        }
        @media (max-width: 480px) {
          .car-gallery-main {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
