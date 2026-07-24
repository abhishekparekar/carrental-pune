import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiRefreshCw, FiSearch, FiSliders, FiCheck } from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars } from '../../firebase/firestore';
import { seedInitialCars } from '../../firebase/seedData';
import { formatCurrency } from '../../utils/formatCurrency';

const CITIES = ['All Cities', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
const CATEGORY_TABS = [
  { id: 'all', label: 'All Fleet' },
  { id: 'hatchback', label: 'Hatchback' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV & 4x4' },
  { id: 'premium', label: 'Luxury' },
];
const TRANSMISSIONS = ['All', 'manual', 'automatic'];
const FUELS = ['All', 'petrol', 'diesel', 'electric', 'cng'];

export default function FleetPage() {
  const { tenantId } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || 'All');
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuel') || 'All');
  const [priceBasis, setPriceBasis] = useState('day');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    seedInitialCars(tenantId).catch(console.error);
    const unsub = subscribeToCars(tenantId, (data) => {
      setCars(data);
      setLoading(false);
    });
    return () => unsub();
  }, [tenantId]);

  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedCity !== 'All Cities') params.city = selectedCity;
    if (selectedTransmission !== 'All') params.transmission = selectedTransmission;
    if (selectedFuel !== 'All') params.fuel = selectedFuel;
    if (maxPrice < 10000) params.maxPrice = maxPrice;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedCity, selectedTransmission, selectedFuel, maxPrice]);

  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedCity('All Cities');
    setSelectedTransmission('All');
    setSelectedFuel('All');
    setMaxPrice(10000);
    setSearchQuery('');
    setSortBy('popular');
  };

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      if (selectedCategory !== 'all' && car.category !== selectedCategory) return false;
      if (selectedCity !== 'All Cities' && car.citiesAvailable && !car.citiesAvailable.includes(selectedCity)) {
        return false;
      }
      if (selectedTransmission !== 'All' && car.transmission !== selectedTransmission) return false;
      if (selectedFuel !== 'All' && car.fuelType !== selectedFuel) return false;

      const comparePrice = priceBasis === 'hour' ? (car.pricePerHour || 0) : (car.pricePerDay || 0);
      if (comparePrice > maxPrice) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = car.name?.toLowerCase().includes(q);
        const matchBrand = car.brand?.toLowerCase().includes(q);
        if (!matchName && !matchBrand) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = priceBasis === 'hour' ? a.pricePerHour : a.pricePerDay;
        const priceB = priceBasis === 'hour' ? b.pricePerHour : b.pricePerDay;
        return (priceA || 0) - (priceB || 0);
      }
      if (sortBy === 'price-high') {
        const priceA = priceBasis === 'hour' ? a.pricePerHour : a.pricePerDay;
        const priceB = priceBasis === 'hour' ? b.pricePerHour : b.pricePerDay;
        return (priceB || 0) - (priceA || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });
  }, [cars, selectedCategory, selectedCity, selectedTransmission, selectedFuel, priceBasis, maxPrice, searchQuery, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedCity !== 'All Cities') count++;
    if (selectedTransmission !== 'All') count++;
    if (selectedFuel !== 'All') count++;
    if (maxPrice < 10000) count++;
    return count;
  }, [selectedCategory, selectedCity, selectedTransmission, selectedFuel, maxPrice]);

  const FilterPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
        <h3 style={{ fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A', fontWeight: 800, whiteSpace: 'nowrap' }}>
          <FiSliders color="var(--color-accent)" size={17} /> Filter Fleet
        </h3>
        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            color: '#EF4444',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <FiRefreshCw size={12} /> Reset
        </button>
      </div>

      {/* City */}
      <div className="form-group">
        <label className="form-label">City Location</label>
        <select
          className="form-select"
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
        >
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category Radio Buttons */}
      <div>
        <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CATEGORY_TABS.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#0F172A', fontWeight: selectedCategory === cat.id ? 700 : 500 }}>
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.id}
                onChange={() => setSelectedCategory(cat.id)}
                style={{ accentColor: 'var(--color-accent)' }}
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      {/* Pricing Slider */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label className="form-label">Max Price Cap</label>
          <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', padding: 2, borderRadius: 'var(--radius-sm)' }}>
            <button
              className={`btn btn-sm ${priceBasis === 'day' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setPriceBasis('day'); setMaxPrice(10000); }}
              style={{ padding: '2px 8px', fontSize: 11 }}
            >
              Day
            </button>
            <button
              className={`btn btn-sm ${priceBasis === 'hour' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setPriceBasis('hour'); setMaxPrice(1000); }}
              style={{ padding: '2px 8px', fontSize: 11 }}
            >
              Hour
            </button>
          </div>
        </div>

        <input
          type="range"
          min={priceBasis === 'hour' ? 50 : 500}
          max={priceBasis === 'hour' ? 1000 : 10000}
          step={priceBasis === 'hour' ? 10 : 100}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
        />
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 600 }}>
          Max {formatCurrency(maxPrice)} / {priceBasis}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="form-label" style={{ marginBottom: 6, display: 'block' }}>Transmission</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {TRANSMISSIONS.map(t => (
            <button
              key={t}
              className={`btn btn-sm ${selectedTransmission === t ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedTransmission(t)}
              style={{ padding: '4px 0', textTransform: 'capitalize', fontSize: 11, justifyContent: 'center' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="form-label" style={{ marginBottom: 6, display: 'block' }}>Fuel Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {FUELS.map(f => (
            <button
              key={f}
              className={`btn btn-sm ${selectedFuel === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedFuel(f)}
              style={{ padding: '4px 0', textTransform: 'capitalize', fontSize: 11, justifyContent: 'center' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 90, paddingBottom: 60, flex: 1 }}>
        <div className="container">
          {/* Header Title Section */}
          <div style={{ marginBottom: 24 }}>
            <span className="section-label-red">Self-Drive Fleet</span>
            <h1 style={{ fontSize: 32, margin: '6px 0 4px', color: '#0F172A', fontWeight: 800 }}>
              Choose Your Perfect <span style={{ color: '#EF4444' }}>Self-Drive Car</span>
            </h1>
            <p style={{ fontSize: 14, color: '#475569', margin: 0 }}>
              Showing {filteredCars.length} available sanitized vehicle{filteredCars.length === 1 ? '' : 's'} with doorstep delivery & unlimited km
            </p>
          </div>

          {/* Quick Category Filter Pills (Scrollable on Mobile) */}
          <div style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 12,
            marginBottom: 20,
            scrollbarWidth: 'none',
          }}>
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 13,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedCategory === tab.id ? '1px solid #EF4444' : '1px solid #E2E8F0',
                  background: selectedCategory === tab.id ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(255, 255, 255, 0.95) 100%)' : '#FFFFFF',
                  color: selectedCategory === tab.id ? '#EF4444' : '#0F172A',
                  boxShadow: selectedCategory === tab.id ? '0 2px 10px rgba(239, 68, 68, 0.1)' : '0 2px 6px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {selectedCategory === tab.id && <FiCheck size={14} />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls Bar (Search, Sort, Mobile Filter Trigger) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
            background: '#FFFFFF',
            padding: '14px 18px',
            borderRadius: 14,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: 11, color: '#94A3B8' }} size={16} />
              <input
                type="text"
                placeholder="Search by brand or car model (e.g. Creta, Thar, BMW)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 36, height: 38, fontSize: 13, borderRadius: 10, border: '1px solid #E2E8F0' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <select
                className="form-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ height: 38, fontSize: 13, width: 160, borderRadius: 10, border: '1px solid #E2E8F0' }}
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                className="btn btn-secondary btn-sm mobile-only"
                onClick={() => setMobileFilterOpen(true)}
                style={{ height: 38, borderRadius: 10, gap: 6 }}
              >
                <FiFilter size={15} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>

          {/* Main Fleet Layout (Desktop Sidebar + Car Cards Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: 28 }} className="fleet-layout">
            <aside className="desktop-only" style={{
              padding: 22,
              alignSelf: 'start',
              position: 'sticky',
              top: 84,
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            }}>
              <FilterPanel />
            </aside>

            <section>
              {loading ? (
                <div className="grid-3">
                  <CarSkeleton />
                  <CarSkeleton />
                  <CarSkeleton />
                </div>
              ) : filteredCars.length === 0 ? (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(255,87,34,0.08) 100%)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <BsCarFront size={28} />
                  </div>
                  <h3 style={{ fontSize: 18, color: '#0F172A', fontWeight: 800, marginBottom: 6 }}>
                    No Cars Match Your Filter Criteria
                  </h3>
                  <p style={{ fontSize: 13, color: '#475569', maxWidth: 420, margin: '0 auto 16px', lineHeight: 1.5 }}>
                    Try adjusting your category, price cap slider, or location filters to see more cars.
                  </p>
                  <button onClick={handleReset} className="btn btn-primary btn-sm" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)' }}>
                    Reset All Filters ➔
                  </button>
                </div>
              ) : (
                <div className="grid-3">
                  {filteredCars.map(car => (
                    <RevvCarCard
                      key={car.id}
                      car={car}
                      onEnquire={carItem => {
                        setSelectedCar(carItem);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Mobile Filters Slide-Up Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,23,42,0.5)',
                zIndex: 9998,
                backdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '85vh',
                overflowY: 'auto',
                background: '#FFFFFF',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: '20px 20px 30px',
                zIndex: 9999,
                boxShadow: '0 -10px 30px rgba(15, 23, 42, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
                <h3 style={{ fontSize: 18, margin: 0, color: '#0F172A', fontWeight: 800 }}>Filter Vehicles</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#F1F5F9',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <FiX size={18} color="#0F172A" />
                </button>
              </div>

              <FilterPanel />

              <button
                className="btn btn-primary"
                onClick={() => setMobileFilterOpen(false)}
                style={{ width: '100%', marginTop: 24, padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 700 }}
              >
                Apply Filters ({filteredCars.length} Cars)
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Inquiry Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCar ? `Inquire — ${selectedCar.name}` : 'Rental Inquiry'}
      >
        {selectedCar && (
          <BookingForm
            car={selectedCar}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      <Footer />
    </div>
  );
}
