import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiRefreshCw, FiSearch, FiSliders } from 'react-icons/fi';

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
const CATEGORIES = [
  { id: 'hatchback', label: 'Hatchback' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV & 4x4' },
  { id: 'premium', label: 'Luxury & Sports' },
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

  const FilterPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text)' }}>
          <FiSliders color="var(--color-accent)" /> Filter Fleet
        </h3>
        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-accent)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <FiRefreshCw size={11} /> Reset
        </button>
      </div>

      {/* City */}
      <div className="form-group">
        <label className="form-label">Location City</label>
        <select
          className="form-select"
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
        >
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--color-text)' }}>
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'all'}
              onChange={() => setSelectedCategory('all')}
              style={{ accentColor: 'var(--color-accent)' }}
            />
            All Categories
          </label>
          {CATEGORIES.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--color-text)' }}>
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
          <label className="form-label">Price Cap</label>
          <div style={{ display: 'flex', gap: 2, background: 'var(--color-bg-alt)', padding: 2, borderRadius: 'var(--radius-sm)' }}>
            <button
              className={`btn btn-sm ${priceBasis === 'day' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '2px 8px', fontSize: 10 }}
              onClick={() => setPriceBasis('day')}
            >
              ₹/Day
            </button>
            <button
              className={`btn btn-sm ${priceBasis === 'hour' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '2px 8px', fontSize: 10 }}
              onClick={() => setPriceBasis('hour')}
            >
              ₹/Hr
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
        <div style={{ fontSize: 12, color: 'var(--color-text-2)', marginTop: 4, fontWeight: 600 }}>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ paddingTop: 90, paddingBottom: 60, flex: 1 }}>
        <div className="container">
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              <h1 style={{ fontSize: 28, margin: 0 }}>Self-Drive <span>Car Fleet</span></h1>
              <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>
                Showing {filteredCars.length} available car{filteredCars.length === 1 ? '' : 's'}
              </p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 200 }}>
                <FiSearch style={{ position: 'absolute', left: 10, top: 12, color: 'var(--color-text-3)' }} />
                <input
                  type="text"
                  placeholder="Search brand/model..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 32, height: 38, fontSize: 13 }}
                />
              </div>

              <select
                className="form-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ height: 38, fontSize: 13, width: 150 }}
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <button
                className="btn btn-secondary btn-sm mobile-only"
                onClick={() => setMobileFilterOpen(true)}
              >
                <FiFilter /> Filters
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }} className="fleet-layout">
            <aside className="glass-card desktop-only" style={{ padding: 20, alignSelf: 'start', position: 'sticky', top: 80, background: '#FFFFFF' }}>
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
                <div className="glass-card empty-state" style={{ background: '#FFFFFF' }}>
                  <div className="empty-state-icon">🚘</div>
                  <div className="empty-state-title">No cars match your criteria</div>
                  <div className="empty-state-desc">
                    Try adjusting your price cap or fuel type filter.
                  </div>
                  <button onClick={handleReset} className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                    Reset Filters
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

      {/* Mobile Drawer */}
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
                background: 'rgba(15,23,42,0.4)',
                zIndex: 'var(--z-modal)',
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="glass-card"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '85vh',
                overflowY: 'auto',
                zIndex: 'calc(var(--z-modal) + 1)',
                padding: 20,
                background: '#FFFFFF',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>Filter Fleet</h3>
                <button className="btn-icon" onClick={() => setMobileFilterOpen(false)}><FiX /></button>
              </div>
              <FilterPanel />
              <button
                className="btn btn-primary w-full"
                onClick={() => setMobileFilterOpen(false)}
                style={{ marginTop: 20 }}
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
        @media (max-width: 900px) {
          .fleet-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
