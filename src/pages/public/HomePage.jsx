import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { FiSearch, FiMapPin, FiCalendar, FiChevronLeft, FiChevronRight, FiShield, FiClock, FiKey, FiTruck, FiArrowRight, FiZap, FiCheckCircle, FiStar } from 'react-icons/fi';
import { BsCarFront, BsStarFill, BsAward, BsCarFrontFill, BsWhatsapp } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';
import TermsAndConditions from '../../components/ui/TermsAndConditions';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars, subscribeToReviews } from '../../firebase/firestore';

import heroBgImg from '../../assets/herobg1.jpeg';
import logoImg from '../../assets/logo1.jpeg';
import familyTravelImg from '../../assets/family_travel.jpg';

const DEFAULT_REVIEWS = [
  {
    name: 'Rahul Deshmukh',
    location: 'Pune (Kothrud)',
    carName: 'Mahindra Thar 4x4',
    rating: 5,
    date: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    comment: 'Booked Thar 4x4 for a weekend trip to Mahabaleshwar. 300 km daily limit was more than enough! Doorstep delivery was quick.',
    verified: true,
  },
  {
    name: 'Priya Sharma',
    location: 'Pune (Viman Nagar)',
    carName: 'Maruti Swift ZXi',
    rating: 5,
    date: '1 week ago',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    comment: 'Best self-drive car service in Pune! Transparent pricing, deposit was returned promptly upon car handover.',
    verified: true,
  },
];

const CITIES = ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

const CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback', desc: 'Swift, i20, Baleno — Easy city handling & peppy drive', icon: <BsCarFront size={24} /> },
  { id: 'sedan', name: 'Sedan & CNG', desc: 'Dzire CNG — Maximum fuel efficiency for long trips', icon: <BsCarFrontFill size={24} /> },
  { id: 'suv', name: 'SUV & 4x4', desc: 'Thar 4x4, Punch, Venue — Off-road power & ground clearance', icon: <FiTruck size={24} /> },
  { id: 'muv', name: '7-Seater MUV', desc: 'Ertiga Manual & Automatic — Spacious 7-seater family comfort', icon: <BsCarFront size={24} /> },
];

const FEATURES = [
  { icon: <FiTruck size={22} />, title: 'Doorstep Delivery', desc: 'Sanitized cars delivered right to your home or airport terminal.' },
  { icon: <FiKey size={22} />, title: 'Unlimited Kilometers', desc: 'Drive freely without counting kilometers or extra per-km fees.' },
  { icon: <FiShield size={22} />, title: 'Insurance Included', desc: 'Comprehensive damage coverage and All India Tourist Permit.' },
  { icon: <FiClock size={22} />, title: '24/7 Roadside Assist', desc: 'Round-the-clock emergency support and instant vehicle assistance.' },
  { icon: <FiZap size={22} />, title: 'Zero Security Deposit', desc: 'No heavy deposits blocked. Simple paperless verification.' },
  { icon: <FiCheckCircle size={22} />, title: 'Deep Sanitized Fleet', desc: '100% sanitized vehicles after every single trip completion.' },
  { icon: <BsCarFront size={22} />, title: 'Well Maintained Cars', desc: 'Brand new 2024-26 model cars serviced by official dealers.' },
  { icon: <FiStar size={22} />, title: 'Transparent Pricing', desc: 'No hidden taxes or unexpected surcharges at checkout.' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', initials: 'RS', city: 'Pune', role: 'Software Engineer', comment: 'Rented a Fronx for a trip to Lonavala. Car was delivered right at my door in Pune. Super smooth booking experience!', rating: 5, carUsed: 'Maruti Fronx 2026' },
  { name: 'Priya Verma', initials: 'PV', city: 'Bangalore', role: 'Product Manager', comment: 'The Innova Hycross gave us royal comfort for our family road trip to Coorg. 10/10 service and vehicle quality!', rating: 5, carUsed: 'Innova Hycross AT' },
  { name: 'Anish Kulkarni', initials: 'AK', city: 'Mumbai', role: 'Entrepreneur', comment: 'Extremely easy booking process. Rented the Mahindra Thar 4x4 for mountain camping. Highly recommended!', rating: 5, carUsed: 'Thar 4x4 Convertible' },
  { name: 'Sneha Deshmukh', initials: 'SD', city: 'Hyderabad', role: 'Architect', comment: 'Zero security deposit hassle and 100% clean sanitized car. NextRent is now my go-to self-drive app!', rating: 5, carUsed: 'Hyundai Creta' },
  { name: 'Deepak Patel', initials: 'DP', city: 'Delhi NCR', role: 'Business Owner', comment: 'Booked Scorpio N for a 5-day trip to Manali. Unlimited km option saved us so much money on fuel & fees!', rating: 5, carUsed: 'Scorpio N 2025' },
  { name: 'Meera Kapoor', initials: 'MK', city: 'Chennai', role: 'Design Lead', comment: 'Doorstep drop and pick up made my weekend drive completely stress-free. Premium service quality!', rating: 5, carUsed: 'Swift ZXi' },
];

export default function HomePage() {
  const { tenantId } = useTenant();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hero Search Form state
  const [city, setCity] = useState('Pune');
  const [pickupDate, setPickupDate] = useState(new Date(Date.now() + 86400000));
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 86400000 * 3));

  // Swiper Navigation refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const unsubCars = subscribeToCars(tenantId, (data) => {
      setCars(data);
      setLoading(false);
    });
    const unsubReviews = subscribeToReviews(tenantId, (data) => {
      setReviews(data || []);
    });
    return () => {
      unsubCars();
      unsubReviews();
    };
  }, [tenantId]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/fleet?city=${encodeURIComponent(city)}`);
  };

  const openEnquiry = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F7F8' }}>
      <Navbar />

      {/* 1. CINEMATIC ANIMATED HERO SECTION */}
      <section
        className="hero-bg-section"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(8,8,8,0.75) 55%, rgba(180,0,0,0.28) 100%), url("${heroBgImg}")`,
        }}
      >
        {/* Red Crimson Glow — top right */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-8%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,0,0,0.30) 0%, rgba(204,0,0,0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />
        {/* Silver shimmer — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '0%',
          left: '-5%',
          width: 400,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(180,180,180,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>


            {/* Business Name Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{ marginBottom: 16 }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 20px',
                borderRadius: '9999px',
                background: 'rgba(200, 0, 10, 0.22)',
                border: '1px solid rgba(229, 0, 16, 0.45)',
                color: '#FFFFFF',
                fontSize: 'clamp(12px, 2.2vw, 15px)',
                fontWeight: 900,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 24px rgba(200, 0, 10, 0.40)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}>
                <BsCarFront color="#E50010" size={16} /> SA SELF DRIVE CAR RENT
              </span>
            </motion.div>

            {/* Main Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hero-main-title"
              style={{
                color: '#FFFFFF',
                fontWeight: 900,
                lineHeight: 1.15,
                textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              }}
            >
              <span>Drive Your Freedom, Your Way.</span><br />
              <span style={{ color: '#E50010', textShadow: '0 0 35px rgba(229,0,16,0.75)' }}>
                S A SELF DRIVE CAR RENT
              </span>
            </motion.h1>

            {/* Floating Trust Metrics Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="hero-trust-badges"
            >
              {[
                { icon: <FiCheckCircle color="#22C55E" size={13} />, text: '10,000+ Happy Renters' },
                { icon: <BsCarFront color="#CC0000" size={13} />, text: 'Premium Fleet' },
                { icon: <FiStar color="#F59E0B" size={13} />, text: '4.9★ Rating' },
              ].map((item, idx) => (
                <div key={idx} className="hero-trust-pill">
                  {item.icon} <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Hero Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                marginTop: 24,
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/fleet"
                className="btn btn-primary btn-lg"
                style={{ padding: '14px 32px', fontSize: 15, fontWeight: 800 }}
              >
                <BsCarFront size={18} /> Explore Our Fleet
              </Link>
              <a
                href="https://wa.me/919270762176?text=Hi%20SA%20Self%20Drive%20Cars,%20I%20want%20to%20inquire%20about%20booking%20a%20car."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
                style={{
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                WhatsApp Inquiry (+91 9270762176)
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TOP SELLING CARS SECTION */}
      <section style={{ padding: '32px 0 24px', background: '#FFFFFF' }}>
        <div className="container">
          {/* Section Header with Left Title + Right Carousel Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span className="section-label">Most Popular</span>
              <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: '#111318', margin: 0 }}>
                Top Cars in <span style={{ color: '#C8000A' }}>{city}</span>
              </h2>
            </div>

            {/* Custom Carousel Arrows */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                ref={prevRef}
                className="btn-icon"
                style={{ width: 36, height: 36, borderRadius: '50%' }}
                aria-label="Previous cars"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                ref={nextRef}
                className="btn-icon"
                style={{ width: 36, height: 36, borderRadius: '50%' }}
                aria-label="Next cars"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Swiper Carousel */}
          {loading ? (
            <div className="grid-4">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : cars.filter(c => c.isPopular !== false).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: 13 }}>
              No cars currently marked as popular. Admin can toggle Popular Choice in Admin Panel.
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={14}
              slidesPerView={1.2}
              breakpoints={{
                420: { slidesPerView: 1.5, spaceBetween: 12 },
                640: { slidesPerView: 2.2, spaceBetween: 14 },
                960: { slidesPerView: 3.2, spaceBetween: 16 },
                1280: { slidesPerView: 4.1, spaceBetween: 18 },
                1600: { slidesPerView: 4.8, spaceBetween: 20 },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              style={{ paddingBottom: 8 }}
            >
              {cars.filter(c => c.isPopular !== false).map((car) => (
                <SwiperSlide key={car.id} style={{ height: 'auto' }}>
                  <RevvCarCard car={car} onEnquire={openEnquiry} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* 3. FULL FLEET SECTION */}
      <section className="section-sm" style={{ background: '#F7F7F8', borderTop: '1px solid #E4E6EA', borderBottom: '1px solid #E4E6EA' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="section-label">Full Fleet</span>
              <h2 className="section-title" style={{ margin: 0 }}>All Available <span>Self-Drive Cars</span></h2>
            </div>
            <Link to="/fleet" className="btn btn-secondary btn-sm">
              View All Fleet <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="home-fleet-grid">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : (
            <>
              <div className="home-fleet-grid">
                {cars.slice(0, 8).map((car) => (
                  <RevvCarCard key={car.id} car={car} onEnquire={openEnquiry} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <Link to="/fleet" className="btn btn-primary btn-md" style={{ padding: '10px 24px', fontSize: 14 }}>
                  Explore All Fleet ({cars.length}+ Cars) <FiArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. CATEGORIES - INFINITE MARQUEE */}
      <section className="section-sm" style={{ background: '#FBF4F4', borderTop: '1px solid rgba(200,0,10,0.10)', borderBottom: '1px solid rgba(200,0,10,0.10)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label-red">Browse Fleet</span>
            <h2 className="section-title">Explore by <span>Category</span></h2>
          </div>
        </div>

        <div className="marquee-container">
          <div className="category-marquee-track">
            {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, idx) => (
              <Link
                key={idx}
                to={`/fleet?category=${cat.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: 260,
                    flexShrink: 0,
                    padding: 22,
                    textAlign: 'center',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    borderRadius: 16,
                    border: '1px solid rgba(200,0,10,0.12)',
                    boxShadow: '0 4px 20px rgba(17,19,24,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(200,0,10,0.09) 0%, rgba(200,0,10,0.05) 100%)',
                    border: '1px solid rgba(200,0,10,0.18)',
                    color: '#C8000A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    {cat.icon}
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 4, color: '#111318', fontWeight: 800 }}>{cat.name}</h3>
                  <p style={{ fontSize: 12, color: '#6B7080', margin: 0, lineHeight: 1.5 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 DIRECT HOMEPAGE INQUIRY FORM & MARKETING SHOWCASE */}
      <section id="inquiry-form-section" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: 'clamp(28px, 4vw, 48px) 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 24 }}>
            <span className="section-label-red">Instant Booking & Fast Confirmation</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(22px, 3.8vw, 32px)', margin: '6px 0 8px' }}>
              Book Your <span>Self-Drive Car</span> in Minutes
            </h2>
            <p className="section-desc" style={{ maxWidth: 620, margin: '0 auto' }}>
              Choose your favorite car, select trip dates, and get prompt vehicle delivery right at your doorstep in Pune & PCMC.
            </p>
          </div>

          <div className="inquiry-section-grid">
            {/* Left Column: Interactive Booking Form */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 'clamp(16px, 2.5vw, 26px)',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #F1F5F9' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Rental Details & Fast Quotation
                </h3>
                <span style={{ fontSize: 11.5, color: '#64748B' }}>
                  No heavy security deposit • Transparent pricing • 5 Simple documents
                </span>
              </div>
              <BookingForm car={null} onSuccess={() => toast.success('Rental inquiry submitted! We will reach out shortly.')} />
            </div>

            {/* Right Column: Family Traveling & Marketing Showcase Card */}
            <div className="marketing-travel-card" style={{
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.12)',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 460,
              background: '#0F172A',
            }}>
              {/* Background Marketing Photo */}
              <img
                src={familyTravelImg}
                alt="Family road trip in self-drive car"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0,
                }}
              />

              {/* Dark & Brand Gradient Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0.65) 45%, rgba(15, 23, 42, 0.95) 100%)',
                zIndex: 1,
              }} />

              {/* Top Floating Badge */}
              <div style={{ position: 'relative', zIndex: 2, padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#0F172A',
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 800,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}>
                  <FiStar color="#F59E0B" fill="#F59E0B" size={13} /> 4.9★ Rated • 10,000+ Happy Trips
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(200, 0, 10, 0.90)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: 99,
                  fontSize: 11.5,
                  fontWeight: 800,
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 14px rgba(200, 0, 10, 0.4)',
                }}>
                  <FiTruck size={12} /> Doorstep Delivery
                </span>
              </div>

              {/* Bottom Content & Value Propositions */}
              <div style={{ position: 'relative', zIndex: 2, padding: '20px', color: '#FFFFFF' }}>
                <span style={{
                  color: '#E50010',
                  textTransform: 'uppercase',
                  fontWeight: 900,
                  fontSize: 11,
                  letterSpacing: '1.5px',
                  display: 'block',
                  marginBottom: 4,
                }}>
                  Family Vacations & Long Drives
                </span>
                <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 8px', lineHeight: 1.25 }}>
                  Safe & Memorable Family Road Trips
                </h3>
                <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.55, margin: '0 0 16px', maxWidth: 440 }}>
                  Travel in clean, sanitized and commercially insured cars. Enjoy 300 km daily limit for stress-free travel across Lonavala, Mahabaleshwar, Goa, and beyond.
                </p>

                {/* 4 Feature Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
                  {[
                    { icon: <FiCheckCircle color="#22C55E" size={13} />, text: '100% Sanitized Fleet' },
                    { icon: <FiKey color="#F59E0B" size={13} />, text: '300 KM Daily Limit' },
                    { icon: <FiTruck color="#38BDF8" size={13} />, text: '30-Min Doorstep Drop' },
                    { icon: <FiShield color="#A855F7" size={13} />, text: 'Commercial Permits' },
                  ].map((f, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      padding: '6px 10px',
                      borderRadius: 10,
                      fontSize: 11.5,
                      fontWeight: 600,
                    }}>
                      {f.icon}
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* Direct WhatsApp Action */}
                <a
                  href="https://wa.me/919270762176?text=Hi%20SA%20Self%20Drive%20Cars,%20I%20want%20to%20book%20a%20family%20road%20trip%20car."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '11px 18px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #25D366 0%, #1EAA52 100%)',
                    color: '#FFFFFF',
                    fontSize: 13.5,
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <BsWhatsapp size={16} /> Instant WhatsApp Support (+91 9270762176)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="section-sm" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label">Why Choose SA Self Drive</span>
            <h2 className="section-title">The Ultimate <span>Self-Drive</span> Experience</h2>
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...FEATURES, ...FEATURES].map((feat, idx) => (
              <div
                key={idx}
                style={{
                  width: 290,
                  flexShrink: 0,
                  padding: 22,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E4E6EA',
                  boxShadow: '0 4px 18px rgba(17,19,24,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: 'rgba(200,0,10,0.07)',
                  border: '1px solid rgba(200,0,10,0.16)',
                  color: '#C8000A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: 16, color: '#111318', fontWeight: 800, margin: 0 }}>{feat.title}</h3>
                <p style={{ fontSize: 13, color: '#5A5F6E', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 TERMS & CONDITIONS SECTION */}
      <section className="section-sm" style={{ background: '#FFFFFF', borderTop: '1px solid #E4E6EA' }}>
        <div className="container">
          <TermsAndConditions expandable={true} defaultOpen={true} />
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="section-sm" style={{ background: '#F7F7F8', borderTop: '1px solid #E4E6EA', paddingBottom: 48 }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label-red">Reviews</span>
            <h2 className="section-title">Loved by <span>Drivers</span></h2>
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: 13 }}>
              No customer reviews published yet. Admin can add live customer reviews in Admin Panel Settings.
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  style={{
                    padding: 22,
                    background: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px solid #E4E6EA',
                    boxShadow: '0 4px 20px rgba(17,19,24,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 14,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', gap: 3, color: '#F59E0B' }}>
                        {[...Array(rev.rating || 5)].map((_, i) => <BsStarFill key={i} size={14} />)}
                      </div>
                      <span style={{ fontSize: 11, background: 'rgba(22,163,74,0.08)', color: '#16A34A', fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(22,163,74,0.2)' }}>
                        Verified Customer
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontStyle: 'italic', color: '#5A5F6E', margin: 0, lineHeight: 1.6 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, borderTop: '1px solid #F0F1F3' }}>
                    <div style={{
                      width: 38, height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #C8000A 0%, #900007 100%)',
                      color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800,
                      boxShadow: '0 2px 10px rgba(200,0,10,0.30)',
                    }}>
                      {rev.name?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: 14, color: '#111318', lineHeight: 1.2 }}>{rev.name}</strong>
                      <span style={{ fontSize: 11, color: '#8C909A' }}>{rev.location || 'Pune'} • {rev.carName || 'Self Drive'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ENQUIRY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCar ? `Enquire for ${selectedCar.name}` : 'Rental Inquiry'}
      >
        <BookingForm
          car={selectedCar}
          onSuccess={() => {
            setTimeout(() => setIsModalOpen(false), 2500);
          }}
        />
      </Modal>

      <Footer />

      <style>{`
        .inquiry-section-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);
          gap: clamp(16px, 2.5vw, 32px);
          align-items: stretch;
        }
        @media (max-width: 1024px) {
          .inquiry-section-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .marketing-travel-card {
            min-height: 400px !important;
          }
        }
        @media (max-width: 640px) {
          .marketing-travel-card {
            min-height: 380px !important;
          }
        }
        .home-fleet-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(14px, 1.8vw, 20px);
        }
        @media (min-width: 1600px) {
          .home-fleet-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 22px;
          }
        }
        @media (max-width: 1200px) {
          .home-fleet-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 800px) {
          .home-fleet-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .home-fleet-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
        @media (max-width: 360px) {
          .home-fleet-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
