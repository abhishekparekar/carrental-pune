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
  FiLock,
  FiPhoneCall,
  FiX,
  FiArrowRight,
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
  const { tenantId, settings } = useTenant();
  const navigate = useNavigate();

  const phoneDisplay = settings?.phone || '+91 9270762176';
  const phoneRaw = (settings?.phone || '919270762176').replace(/\D/g, '');
  const waRaw = (settings?.whatsapp || settings?.phone || '919270762176').replace(/\D/g, '');

  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              {/* 1. Compact Vehicle Photo Showcase */}
              <div className="car-showcase-card" style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                padding: '12px',
                position: 'relative',
              }}>
                <div
                  className="car-showcase-img-wrap"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 'clamp(175px, 22vw, 250px)',
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
                          width: 52,
                          height: 34,
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

              {/* 2. Unified Ultra-Compact Fleet Info Card */}
              <div className="car-info-unified-card" style={{
                background: '#FFFFFF',
                borderRadius: 14,
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 12px rgba(15, 23, 42, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                {/* Header: Title + Model Year + Daily Rate */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <div>
                    <h1 className="text-gradient-dark" style={{ fontSize: 'clamp(17px, 2.5vw, 22px)', margin: 0, fontWeight: 900, lineHeight: 1.2 }}>
                      {car.name}
                    </h1>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: '#C8000A', background: 'rgba(200,0,10,0.08)', padding: '2px 7px', borderRadius: 5, marginTop: 3, display: 'inline-block' }}>
                      {car.modelYear || '2025'} Model
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="text-gradient-red" style={{ fontSize: 20, fontWeight: 900, display: 'block', lineHeight: 1.1 }}>
                      {formatCurrency(car.pricePerDay || 2800)}
                    </span>
                    <span style={{ fontSize: 10, background: 'linear-gradient(135deg, #C8000A 0%, #990008 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block' }}>per 24 hrs</span>
                  </div>
                </div>

                {/* Quick Description */}
                {car.description && (
                  <p style={{ fontSize: 12.5, color: '#334155', margin: 0, lineHeight: 1.45, fontWeight: 550 }}>
                    {car.description}
                  </p>
                )}

                {/* Sleek Horizontal Specs Strip (1 Row) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: 4,
                  padding: '7px 8px',
                  background: '#F8FAFC',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <BsFuelPump style={{ color: '#C8000A', flexShrink: 0 }} size={12} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fuelType}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderLeft: '1px solid #E2E8F0' }}>
                    <FiSettings style={{ color: '#C8000A', flexShrink: 0 }} size={12} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{transmission}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderLeft: '1px solid #E2E8F0' }}>
                    <FiUsers style={{ color: '#C8000A', flexShrink: 0 }} size={12} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.seats || 5} Seats</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderLeft: '1px solid #E2E8F0' }}>
                    <FiZap style={{ color: '#C8000A', flexShrink: 0 }} size={12} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{car.mileage || '18 kmpl'}</span>
                  </div>
                </div>

                {/* Sleek Horizontal Tariff Breakdown Strip (1 Row) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: 4,
                  padding: '7px 8px',
                  background: 'linear-gradient(135deg, rgba(200, 0, 10, 0.04) 0%, rgba(248, 250, 252, 0.95) 100%)',
                  borderRadius: 8,
                  border: '1px solid rgba(200, 0, 10, 0.14)',
                  textAlign: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: 8.5, color: '#C8000A', textTransform: 'uppercase', fontWeight: 850, display: 'block' }}>Daily (24h)</span>
                    <strong style={{ fontSize: 11.5, color: '#C8000A', fontWeight: 900, display: 'block' }}>300 KM</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(200, 0, 10, 0.12)' }}>
                    <span style={{ fontSize: 8.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Extra KM</span>
                    <strong style={{ fontSize: 11.5, color: '#0F172A', fontWeight: 800, display: 'block' }}>₹{car.extraKmRate || (car.seats === 7 ? 7 : 6)}/km</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(200, 0, 10, 0.12)' }}>
                    <span style={{ fontSize: 8.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Overtime</span>
                    <strong style={{ fontSize: 11.5, color: '#0F172A', fontWeight: 800, display: 'block' }}>₹{car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200)}/hr</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(200, 0, 10, 0.12)' }}>
                    <span style={{ fontSize: 8.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Deposit</span>
                    <strong style={{ fontSize: 11.5, color: '#16A34A', fontWeight: 800, display: 'block' }}>{formatCurrency(car.securityDeposit || 2000)}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Terms & Conditions Accordion (DEFAULT CLOSED / OFF) */}
              <div style={{ width: '100%' }}>
                <TermsAndConditions expandable={true} defaultOpen={false} compact={true} />
              </div>
            </div>

            {/* ── RIGHT COLUMN: Premium Dark Booking Card (Exact as mockup) ── */}
            <div className="car-booking-sticky-col">
              <div className="dark-booking-card">
                {/* Top Price */}
                <div className="dark-price-header">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span className="dark-rupee-sign">₹</span>
                    <span className="dark-price-num">{car.pricePerDay || 2800}</span>
                    <span className="dark-price-unit">/ 24 hrs</span>
                  </div>

                  <div className="dark-limit-highlight">
                    <span className="dark-limit-bolt">⚡</span>
                    <strong className="dark-limit-strong">300 KM daily limit included</strong>
                    <span className="dark-limit-sub"> with every booking.</span>
                  </div>
                </div>

                <div className="dark-divider" />

                {/* Key Details Rows */}
                <div className="dark-details-list">
                  <div className="dark-detail-row">
                    <div className="dark-detail-label">
                      <FiKey size={14} className="dark-icon" />
                      <span>Daily Limit</span>
                    </div>
                    <strong className="dark-detail-val">300 KM / 24 hrs</strong>
                  </div>

                  <div className="dark-detail-row">
                    <div className="dark-detail-label">
                      <FiClock size={14} className="dark-icon" />
                      <span>Extra KM Charge</span>
                    </div>
                    <strong className="dark-detail-val">₹{car.extraKmRate || (car.seats === 7 ? 7 : 6)}/km</strong>
                  </div>

                  <div className="dark-detail-row">
                    <div className="dark-detail-label">
                      <FiLock size={14} className="dark-icon" />
                      <span>Refundable Deposit</span>
                    </div>
                    <strong className="dark-detail-val">₹{(car.securityDeposit || 2500).toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="dark-detail-row">
                    <div className="dark-detail-label">
                      <FiTruck size={14} className="dark-icon" />
                      <span>Delivery Location</span>
                    </div>
                    <div style={{ textAlign: 'right', lineHeight: 1.25 }}>
                      <strong className="dark-detail-val" style={{ display: 'block' }}>Pune & PCMC</strong>
                      <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>Doorstep</span>
                    </div>
                  </div>
                </div>

                {/* 3 Pill Action Buttons */}
                <div className="dark-actions-group">
                  {/* 1. Red Book / Inquire Fleet */}
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(true)}
                    className="dark-btn-red"
                  >
                    <FiCalendar size={16} />
                    <span>Book / Inquire Fleet</span>
                    <FiArrowRight size={16} />
                  </button>

                  {/* 2. Green WhatsApp Booking */}
                  <a
                    href={`https://wa.me/${waRaw}?text=Hi%20SA%20Self%20Drive%20Cars,%20I%20want%20to%20book%20${encodeURIComponent(car.name)}%20(${formatCurrency(car.pricePerDay || 2800)}/24%20hrs).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark-btn-green"
                  >
                    <BsWhatsapp size={17} />
                    <span>Instant WhatsApp Booking</span>
                  </a>

                  {/* 3. Direct Call */}
                  <a
                    href={`tel:+${phoneRaw}`}
                    className="dark-btn-outline"
                  >
                    <FiPhoneCall size={15} />
                    <span>Direct Call: {phoneDisplay}</span>
                  </a>
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

      {/* ── STICKY MOBILE BOOKING BAR (As in mockup) ── */}
      <div className="sticky-mobile-booking-bar">
        <div className="sticky-mobile-left">
          <span className="sticky-mobile-price">₹{(car.pricePerDay || 2800).toLocaleString('en-IN')}</span>
          <span className="sticky-mobile-sub">/ 24 hrs • 300 km</span>
        </div>

        <div className="sticky-mobile-right">
          <a
            href={`https://wa.me/${waRaw}?text=Hi%20SA%20Self%20Drive%20Cars,%20I%20want%20to%20book%20${encodeURIComponent(car.name)}%20(${formatCurrency(car.pricePerDay || 2800)}/24%20hrs).`}
            target="_blank"
            rel="noopener noreferrer"
            className="sticky-mobile-wa-btn"
            aria-label="WhatsApp Instant Booking"
          >
            <BsWhatsapp size={19} />
          </a>

          <button
            type="button"
            onClick={() => setIsInquiryModalOpen(true)}
            className="sticky-mobile-book-btn"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* ── INQUIRY MODAL DIALOG ── */}
      {isInquiryModalOpen && (
        <div className="inquiry-modal-backdrop" onClick={() => setIsInquiryModalOpen(false)}>
          <div className="inquiry-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="inquiry-modal-header">
              <div>
                <span style={{ fontSize: 10.5, color: '#C8000A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Fast Booking Inquiry
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  {car.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(false)}
                className="inquiry-modal-close"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="inquiry-modal-body">
              <BookingForm
                car={car}
                onSuccess={() => {
                  toast.success(`Booking request for ${car.name} received!`);
                  setIsInquiryModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

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
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        @media (max-width: 1200px) {
          .similar-cars-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }
        }

        @media (max-width: 900px) {
          .car-detail-compact-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .car-booking-sticky-col {
            position: static !important;
          }
          .similar-cars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
        }

        @media (max-width: 640px) {
          .car-detail-compact-grid {
            gap: 10px !important;
          }
          .car-showcase-card {
            padding: 8px !important;
            border-radius: 12px !important;
          }
          .car-showcase-img-wrap {
            height: 165px !important;
            border-radius: 10px !important;
          }
          .car-info-unified-card {
            padding: 10px 12px !important;
            border-radius: 12px !important;
            gap: 8px !important;
          }
          .car-booking-card {
            border-radius: 14px !important;
          }
          .specs-compact-row,
          .tariff-compact-row {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }
          .specs-compact-row > div,
          .tariff-compact-row > div {
            padding: 6px 8px !important;
          }
          .similar-cars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
        }

        /* ── Premium Dark Booking Card (Mockup Match) ── */
        .dark-booking-card {
          background: linear-gradient(180deg, #111827 0%, #0B0F19 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 22px 20px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
        }

        .dark-price-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dark-rupee-sign {
          color: #FF1E2D;
          font-size: 30px;
          font-weight: 900;
          line-height: 1;
        }

        .dark-price-num {
          color: #FFFFFF;
          font-size: 42px;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .dark-price-unit {
          color: #8B949E;
          font-size: 15px;
          font-weight: 600;
          margin-left: 4px;
        }

        .dark-limit-highlight {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 6px;
          font-size: 12.5px;
          line-height: 1.35;
        }

        .dark-limit-bolt {
          color: #F59E0B;
          font-size: 14px;
        }

        .dark-limit-strong {
          color: #FBBF24;
          font-weight: 800;
        }

        .dark-limit-sub {
          color: #94A3B8;
          font-weight: 550;
        }

        .dark-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.09);
          margin: 16px 0;
        }

        .dark-details-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin-bottom: 22px;
        }

        .dark-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .dark-detail-label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #94A3B8;
          font-weight: 550;
        }

        .dark-icon {
          color: #64748B;
        }

        .dark-detail-val {
          color: #FFFFFF;
          font-weight: 800;
          font-size: 13px;
        }

        .dark-actions-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dark-btn-red {
          background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 14px;
          border: none;
          border-radius: 9999px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          width: 100%;
        }
        .dark-btn-red:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.45);
        }

        .dark-btn-green {
          background: #22C55E;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 14px;
          border: none;
          border-radius: 9999px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
          transition: transform 0.15s ease, background 0.15s ease;
          width: 100%;
        }
        .dark-btn-green:hover {
          transform: translateY(-1px);
          background: #16A34A;
        }

        .dark-btn-outline {
          background: #1C2128;
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #FFFFFF;
          font-weight: 750;
          font-size: 13.5px;
          border-radius: 9999px;
          padding: 11px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: background 0.15s ease, border-color 0.15s ease;
          width: 100%;
        }
        .dark-btn-outline:hover {
          background: #2D333B;
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* ── Sticky Mobile Booking Bar ── */
        .sticky-mobile-booking-bar {
          display: none;
        }

        @media (max-width: 900px) {
          main {
            padding-bottom: 90px !important;
          }
          .sticky-mobile-booking-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 990;
            background: #0B0F19;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            padding: 10px 16px;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.45);
          }
          .sticky-mobile-left {
            display: flex;
            flex-direction: column;
          }
          .sticky-mobile-price {
            color: #FFFFFF;
            font-size: 19px;
            font-weight: 900;
            letter-spacing: -0.02em;
            line-height: 1.1;
          }
          .sticky-mobile-sub {
            color: #94A3B8;
            font-size: 11px;
            font-weight: 600;
          }
          .sticky-mobile-right {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .sticky-mobile-wa-btn {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: #22C55E;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(34, 197, 94, 0.35);
            text-decoration: none;
            flex-shrink: 0;
          }
          .sticky-mobile-book-btn {
            background: #DC2626;
            color: #FFFFFF;
            font-weight: 800;
            font-size: 13.5px;
            border: none;
            border-radius: 9999px;
            padding: 10px 22px;
            cursor: pointer;
            box-shadow: 0 3px 12px rgba(220, 38, 38, 0.4);
            white-space: nowrap;
          }
        }

        /* ── Inquiry Modal ── */
        .inquiry-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          backdrop-filter: blur(4px);
        }

        .inquiry-modal-content {
          background: #FFFFFF;
          border-radius: 16px;
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border: 1px solid #E2E8F0;
        }

        .inquiry-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid #E2E8F0;
          background: #F8FAFC;
          border-radius: 16px 16px 0 0;
        }

        .inquiry-modal-close {
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .inquiry-modal-close:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .inquiry-modal-body {
          padding: 16px 18px;
        }

        @media (max-width: 380px) {
          .car-showcase-img-wrap {
            height: 145px !important;
          }
          .specs-compact-row,
          .tariff-compact-row {
            gap: 5px !important;
          }
          .similar-cars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </div>
  );
}
