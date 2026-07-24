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
import { BsCarFront, BsStarFill, BsAward, BsCarFrontFill } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars } from '../../firebase/firestore';
import { seedInitialCars } from '../../firebase/seedData';

import heroBgImg from '../../assets/herobg1.jpeg';

const CITIES = ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

const CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback', desc: 'Compact & agile for quick city drives', icon: <BsCarFront size={24} /> },
  { id: 'sedan', name: 'Sedan', desc: 'Executive comfort & smooth highway cruises', icon: <BsCarFrontFill size={24} /> },
  { id: 'suv', name: 'SUV & 4x4', desc: 'Power, space & high ground clearance', icon: <FiTruck size={24} /> },
  { id: 'premium', name: 'Luxury', desc: 'Prestige, speed & VIP status', icon: <BsAward size={24} /> },
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
    seedInitialCars(tenantId).catch(console.error);
    const unsub = subscribeToCars(tenantId, (data) => {
      setCars(data);
      setLoading(false);
    });
    return () => unsub();
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      {/* 1. CINEMATIC ANIMATED HERO SECTION */}
      <section
        className="hero-bg-section"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.55) 60%, rgba(255, 87, 34, 0.35) 100%), url("${heroBgImg}")`,
        }}
      >
        {/* Animated Background Shimmer Glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,87,34,0.35) 0%, rgba(255,87,34,0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
         

            {/* Main Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hero-main-title"
              style={{
                color: '#FFFFFF',
                fontWeight: 900,
                lineHeight: 1.15,
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              <span>Drive the Freedom.<br />Rent Self-Drive Cars in </span>
              <span style={{ color: 'var(--color-accent)' }}>Minutes.</span>
            </motion.h1>

            {/* Floating Trust Metrics Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="hero-trust-badges"
            >
              {[
                { icon: <FiCheckCircle color="#10B981" size={13} />, text: '100,000+ Happy Renters' },
                { icon: <BsCarFront color="#FF7043" size={13} />, text: '2,500+ Sanitized Fleet' },
                { icon: <FiStar color="#F59E0B" size={13} />, text: '4.9/5 Rating' },
              ].map((item, idx) => (
                <div key={idx} className="hero-trust-pill">
                  {item.icon} <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* High-Converting Glass Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearch}
              className="hero-search-card"
            >
              {/* City */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F172A', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <FiMapPin style={{ color: 'var(--color-accent)' }} /> CITY LOCATION
                </label>
                <select
                  className="form-select"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  style={{ height: 42, fontWeight: 600, fontSize: 13 }}
                >
                  {CITIES.map(c => <option key={c} value={c}>📍 {c}</option>)}
                </select>
              </div>

              {/* Pickup Date */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F172A', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <FiCalendar style={{ color: 'var(--color-accent)' }} /> PICKUP DATE
                </label>
                <DatePicker
                  selected={pickupDate}
                  onChange={date => setPickupDate(date)}
                  showTimeSelect
                  dateFormat="MMM d, h:mm aa"
                  minDate={new Date()}
                />
              </div>

              {/* Return Date */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F172A', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <FiCalendar style={{ color: 'var(--color-accent)' }} /> RETURN DATE
                </label>
                <DatePicker
                  selected={returnDate}
                  onChange={date => setReturnDate(date)}
                  showTimeSelect
                  dateFormat="MMM d, h:mm aa"
                  minDate={pickupDate}
                />
              </div>

              {/* Search CTA */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ height: 44, justifyContent: 'center', fontSize: 14, fontWeight: 800, width: '100%' }}
              >
                Find Available Cars <FiSearch />
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* 2. TOP SELLING CARS SECTION (DIRECTLY AFTER HERO) */}
      <section style={{ padding: '40px 0 24px', background: '#F8FAFC' }}>
        <div className="container">
          {/* Section Header with Left Title + Right Carousel Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <span className="section-label">Most Popular</span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Top Selling Cars in <span style={{ color: 'var(--color-accent)' }}>{city}</span>
              </h2>
            </div>

            {/* Custom Carousel Arrows */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                ref={prevRef}
                className="btn-icon"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
                aria-label="Previous cars"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                ref={nextRef}
                className="btn-icon"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
                aria-label="Next cars"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Swiper Carousel */}
          {loading ? (
            <div className="grid-3">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={14}
              slidesPerView={1.3}
              breakpoints={{
                480: { slidesPerView: 1.6, spaceBetween: 14 },
                640: { slidesPerView: 2.1, spaceBetween: 16 },
                1024: { slidesPerView: 3.1, spaceBetween: 18 },
                1280: { slidesPerView: 3.4, spaceBetween: 20 },
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
              {cars.map((car) => (
                <SwiperSlide key={car.id} style={{ height: 'auto' }}>
                  <RevvCarCard car={car} onEnquire={openEnquiry} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* 3. FULL FLEET SECTION */}
      <section className="section-sm" style={{ background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
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
            <div className="grid-3">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : (
            <>
              <div className="grid-3">
                {cars.slice(0, 6).map((car) => (
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

      {/* 4. CATEGORIES - INFINITE RIGHT-SIDE SCROLL MARQUEE */}
      <section className="section-sm" style={{ background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%)', borderTop: '1px solid #FEE2E2', borderBottom: '1px solid #FEE2E2' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label-red">Browse Fleet</span>
            <h2 className="section-title">Explore by <span style={{ color: '#EF4444' }}>Category</span></h2>
          </div>
        </div>

        {/* Right-Side Marquee Track */}
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
                    border: '1px solid rgba(239, 68, 68, 0.18)',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(255, 87, 34, 0.08) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    {cat.icon}
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 4, color: '#0F172A', fontWeight: 800 }}>{cat.name}</h3>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US - INFINITE RUNNING MARQUEE */}
      <section className="section-sm" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label">Why Choose NextRent</span>
            <h2 className="section-title">The Ultimate <span>Self-Drive</span> Experience</h2>
          </div>
        </div>

        {/* Marquee Track */}
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
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'var(--color-accent-bg)',
                  border: '1px solid rgba(255,87,34,0.2)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 800, margin: 0 }}>{feat.title}</h3>
                <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS - INFINITE RUNNING REVIEWS MARQUEE */}
      <section className="section-sm" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', paddingBottom: 48 }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label-red">Reviews</span>
            <h2 className="section-title">Loved by <span style={{ color: '#EF4444' }}>Drivers</span></h2>
          </div>
        </div>

        {/* Marquee Track */}
        <div className="marquee-container">
          <div className="review-marquee-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div
                key={idx}
                style={{
                  width: 320,
                  flexShrink: 0,
                  padding: 22,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 3, color: '#F59E0B' }}>
                      {[...Array(t.rating)].map((_, i) => <BsStarFill key={i} size={14} />)}
                    </div>
                    <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      Verified Renter ✓
                    </span>
                  </div>

                  <p style={{ fontSize: 13, fontStyle: 'italic', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                    "{t.comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF7043 0%, #FF5722 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    boxShadow: '0 2px 8px rgba(255, 87, 34, 0.3)',
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: '#0F172A', lineHeight: 1.2 }}>{t.name}</strong>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{t.role} • {t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
