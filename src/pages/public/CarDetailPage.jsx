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

import { useTenant } from '../../contexts/TenantContext';
import { getCar, getCars } from '../../firebase/firestore';
import { formatCurrency } from '../../utils/formatCurrency';
import { Helmet } from 'react-helmet-async';

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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gradient-page-bg)' }}>
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gradient-page-bg)' }}>
        <Navbar />
        <main style={{ paddingTop: 120, flex: 1, textAlign: 'center' }} className="container">
          <h2 className="text-gradient-dark">Car Not Found</h2>
          <p style={{ color: '#475569', marginBottom: 20 }}>
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

  const categoryName = (car.category || 'Hatchback').toUpperCase();
  const transmission = car.transmission 
    ? (car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1).toLowerCase())
    : 'Manual';
  const fuelType = (car.fuelType || 'Petrol').toUpperCase();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gradient-page-bg)' }}>
      <Helmet>
        <title>{car?.name ? `${car.name} Rental Pune | Book Self Drive | SA Self Drive Cars` : 'Self Drive Car Booking in Pune | SA Self Drive Cars'}</title>
        <meta name="title" content={car?.name ? `${car.name} Rental Pune | Book Self Drive | SA Self Drive Cars` : 'Self Drive Car Booking in Pune | SA Self Drive Cars'} />
        <meta name="description" content={car?.name ? `Rent ${car.name} in Pune with 300 KM daily limit, doorstep delivery across Pune & PCMC. 24/7 instant booking & sanitized handover.` : 'Book self drive car in Pune with 300 KM daily limit & doorstep delivery.'} />
        <link rel="canonical" href={`https://www.saselfdrivecar.com/fleet/${carId}`} />
      </Helmet>
      <Navbar />

      <main style={{ paddingTop: 'clamp(74px, 7.5vw, 84px)', paddingBottom: 40, flex: 1 }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          
          {/* Top Compact Bar: Back Button & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <Link
              to="/fleet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12.5,
                fontWeight: 700,
                color: '#C8000A',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, rgba(200, 0, 10, 0.08) 0%, rgba(200, 0, 10, 0.02) 100%)',
                padding: '6px 14px',
                borderRadius: 99,
                border: '1px solid rgba(200, 0, 10, 0.18)',
                transition: 'all 0.15s ease',
              }}
            >
              <FiArrowLeft size={13} /> Back to Fleet
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--gradient-accent-btn)', color: '#FFFFFF', fontWeight: 800, fontSize: 10.5, padding: '3px 10px', borderRadius: 99 }}>
                {categoryName}
              </span>
              <span style={{ fontSize: 11, color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 800, background: '#DCFCE7', padding: '3px 10px', borderRadius: 99, border: '1px solid rgba(22,163,74,0.2)' }}>
                <FiCheckCircle size={11} /> Pune & PCMC Delivery
              </span>
            </div>
          </div>

          {/* Compact 2-Column Responsive Layout */}
          <div className="car-detail-compact-grid">
            
            {/* ── LEFT COLUMN: Visual Showcase, Specs & Policies ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* 1. Compact Vehicle Photo Showcase */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                padding: '12px',
                position: 'relative',
              }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 'clamp(180px, 22vw, 250px)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #EDF2F7',
                  }}
                >
                  <img
                    src={images[selectedImageIndex]}
                    alt={car.name}
                    style={{
                      maxWidth: '92%',
                      maxHeight: '92%',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 8px 20px rgba(15, 23, 42, 0.18))',
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
                      top: 10,
                      right: 10,
                      zIndex: 2,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                    }}
                    title="Share Car Link"
                  >
                    <FiShare2 size={14} color="#334155" />
                  </button>
                </div>

                {/* Compact Thumbnails Strip (if multiple) */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingTop: 8, scrollbarWidth: 'none' }}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: 54,
                          height: 36,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid #C8000A' : '1px solid #CBD5E1',
                          cursor: 'pointer',
                          padding: 1,
                          background: '#F8FAFC',
                          flexShrink: 0,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Car Title & Quick Description */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 className="text-gradient-dark" style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: 0, fontWeight: 900, lineHeight: 1.25 }}>
                    {car.name}
                  </h1>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#C8000A', background: 'rgba(200,0,10,0.08)', padding: '3px 8px', borderRadius: 6 }}>
                    {car.modelYear || '2025'} Model
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#1E293B', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                  {car.description || 'Premium sanitized self-drive rental vehicle with 300 km daily limit, comprehensive insurance & doorstep delivery in Pune & PCMC.'}
                </p>
              </div>

              {/* 3. Compact Key Specifications Grid */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
              }}>
                <span className="section-label-red" style={{ fontSize: 10, marginBottom: 8, display: 'inline-block' }}>
                  Specifications & Performance
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }} className="specs-compact-row">
                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', textTransform: 'uppercase', fontWeight: 850, display: 'block' }}>Fuel</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <BsFuelPump style={{ color: '#C8000A' }} size={12} /> {fuelType}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', textTransform: 'uppercase', fontWeight: 850, display: 'block' }}>Gearbox</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <FiSettings style={{ color: '#C8000A' }} size={12} /> {transmission}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', textTransform: 'uppercase', fontWeight: 850, display: 'block' }}>Seats</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <FiUsers style={{ color: '#C8000A' }} size={12} /> {car.seats || 5} Seater
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', textTransform: 'uppercase', fontWeight: 850, display: 'block' }}>Mileage</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <FiZap style={{ color: '#C8000A' }} size={12} /> {car.mileage || '18 kmpl'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 4. Compact Tariff & Surcharges Grid */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
              }}>
                <span className="section-label-red" style={{ fontSize: 10, marginBottom: 8, display: 'inline-block' }}>
                  Tariff Structure
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }} className="tariff-compact-row">
                  <div style={{ padding: '8px 10px', borderRadius: 10, background: 'linear-gradient(135deg, rgba(200, 0, 10, 0.08) 0%, rgba(200, 0, 10, 0.02) 100%)', border: '1px solid rgba(200, 0, 10, 0.22)' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', fontWeight: 850, textTransform: 'uppercase', display: 'block' }}>Daily (24h)</span>
                    <strong style={{ fontSize: 14, color: '#C8000A', fontWeight: 900, display: 'block', marginTop: 2 }}>
                      {formatCurrency(car.pricePerDay || 2800)}
                    </strong>
                    <span style={{ fontSize: 10, color: '#16A34A', fontWeight: 800 }}>✓ 300 KM</span>
                  </div>

                  <div style={{ padding: '8px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', fontWeight: 850, textTransform: 'uppercase', display: 'block' }}>Extra KM</span>
                    <strong style={{ fontSize: 13, color: '#0F172A', fontWeight: 850, display: 'block', marginTop: 2 }}>
                      ₹{car.extraKmRate || (car.seats === 7 ? 7 : 6)} / km
                    </strong>
                    <span style={{ fontSize: 10, color: '#1E293B', fontWeight: 600 }}>After 300 km</span>
                  </div>

                  <div style={{ padding: '8px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', fontWeight: 850, textTransform: 'uppercase', display: 'block' }}>Overtime</span>
                    <strong style={{ fontSize: 13, color: '#0F172A', fontWeight: 850, display: 'block', marginTop: 2 }}>
                      ₹{car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200)} / hr
                    </strong>
                    <span style={{ fontSize: 10, color: '#1E293B', fontWeight: 600 }}>30m grace</span>
                  </div>

                  <div style={{ padding: '8px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#C8000A', fontWeight: 850, textTransform: 'uppercase', display: 'block' }}>Deposit</span>
                    <strong style={{ fontSize: 13, color: '#0F172A', fontWeight: 850, display: 'block', marginTop: 2 }}>
                      {formatCurrency(car.securityDeposit || 2000)}
                    </strong>
                    <span style={{ fontSize: 10, color: '#16A34A', fontWeight: 800 }}>Refundable</span>
                  </div>
                </div>
              </div>

              {/* 5. Terms & Conditions Accordion (DEFAULT CLOSED / OFF) */}
              <div style={{ width: '100%' }}>
                <TermsAndConditions expandable={true} defaultOpen={false} compact={true} />
              </div>
            </div>

            {/* ── RIGHT COLUMN: Compact Instant Reservation Card (Sticky on desktop) ── */}
            <div className="car-booking-sticky-col">
              <div style={{
                background: '#FFFFFF',
                borderRadius: 18,
                border: '1.5px solid rgba(200, 0, 10, 0.22)',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                overflow: 'hidden',
              }}>
                {/* Header Rate Banner */}
                <div style={{
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, rgba(200, 0, 10, 0.08) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  borderBottom: '1px solid rgba(200, 0, 10, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}>
                  <div>
                    <span style={{ fontSize: 10.5, color: '#C8000A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
                      Fast Online Booking
                    </span>
                    <h2 className="text-gradient-dark" style={{ fontSize: 16, margin: '2px 0 0', fontWeight: 900 }}>
                      Book {car.name}
                    </h2>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="text-gradient-red" style={{ fontSize: 22, fontWeight: 900, display: 'block', lineHeight: 1.1 }}>
                      {formatCurrency(car.pricePerDay || 2800)}
                    </span>
                    <span style={{ fontSize: 10.5, background: 'linear-gradient(135deg, #C8000A 0%, #990008 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>per 24 hrs</span>
                  </div>
                </div>

                {/* Interactive Booking Form */}
                <div style={{ padding: '16px 18px' }}>
                  <BookingForm car={car} onSuccess={() => toast.success(`Booking request for ${car.name} received!`)} />

                  {/* WhatsApp Quick Link */}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <a
                      href={`https://wa.me/919270762176?text=Hi%20SA%20Self%20Drive%20Cars,%20I%20want%20to%20book%20${encodeURIComponent(car.name)}%20(${formatCurrency(car.pricePerDay || 2800)}/day).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 7,
                        padding: '9px 18px',
                        fontSize: 13,
                        fontWeight: 800,
                        width: '100%',
                        borderRadius: 10,
                      }}
                    >
                      <BsWhatsapp size={15} /> WhatsApp Instant Booking (+91 9270762176)
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Similar Vehicles (Compact Row) */}
          {similarCars.length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
              <div style={{ marginBottom: 12 }}>
                <span className="section-label-red" style={{ fontSize: 10.5 }}>Similar Fleet</span>
                <h3 className="section-title" style={{ fontSize: 18, margin: '2px 0 0' }}>
                  More Available <span>{categoryName}s</span>
                </h3>
              </div>
              <div className="similar-cars-grid">
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
        .car-detail-compact-grid {
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          gap: 18px;
          align-items: start;
        }

        .car-booking-sticky-col {
          position: sticky;
          top: 76px;
        }

        .similar-cars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        @media (max-width: 900px) {
          .car-detail-compact-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .car-booking-sticky-col {
            position: static !important;
          }
          .specs-compact-row,
          .tariff-compact-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .similar-cars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }

        @media (max-width: 520px) {
          .similar-cars-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
