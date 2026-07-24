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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 72, paddingBottom: 24, flex: 1 }}>
        <div className="fleet-container" style={{ width: '100%', maxWidth: '100%' }}>

          {/* Top Integrated Search & Filter Console Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '16px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {/* Top Row: Search Input & City / Sort Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
                <FiSearch style={{ position: 'absolute', left: 12, top: 12, color: '#94A3B8' }} size={16} />
                <input
                  type="text"
                  placeholder="Search by brand or car model (e.g. Creta, Thar, BMW)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 36, height: 40, fontSize: 13, borderRadius: 10, border: '1px solid #E2E8F0' }}
                />
              </div>

              {/* City Filter */}
              <select
                className="form-select"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                style={{ height: 40, fontSize: 13, width: 150, borderRadius: 10, border: '1px solid #E2E8F0' }}
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Sort Dropdown */}
              <select
                className="form-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ height: 40, fontSize: 13, width: 160, borderRadius: 10, border: '1px solid #E2E8F0' }}
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* More Filters Toggle Button */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(prev => !prev)}
                style={{
                  height: 40,
                  padding: '0 16px',
                  borderRadius: 10,
                  border: showAdvancedFilters ? '1px solid #EF4444' : '1px solid #E2E8F0',
                  background: showAdvancedFilters ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, #FFFFFF 100%)' : '#F8FAFC',
                  color: showAdvancedFilters ? '#EF4444' : '#0F172A',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <FiSliders size={15} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              {/* Reset Button */}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    height: 40,
                    padding: '0 14px',
                    borderRadius: 10,
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    background: '#FFF5F5',
                    color: '#EF4444',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  <FiRefreshCw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Category Quick Tabs Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
              borderTop: '1px solid #F1F5F9',
              paddingTop: 14,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 4, whiteSpace: 'nowrap' }}>
                Category:
              </span>
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: selectedCategory === tab.id ? '1px solid #EF4444' : '1px solid #E2E8F0',
                    background: selectedCategory === tab.id ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(255, 255, 255, 0.95) 100%)' : '#F8FAFC',
                    color: selectedCategory === tab.id ? '#EF4444' : '#0F172A',
                    boxShadow: selectedCategory === tab.id ? '0 2px 8px rgba(239, 68, 68, 0.1)' : 'none',
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

            {/* Expandable Advanced Filters Row (Transmission, Fuel, Price Cap Slider) */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    overflow: 'hidden',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: 16,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 20,
                  }}
                >
                  {/* Transmission */}
                  <div>
                    <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Transmission</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {TRANSMISSIONS.map(t => (
                        <button
                          key={t}
                          className={`btn btn-sm ${selectedTransmission === t ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setSelectedTransmission(t)}
                          style={{ padding: '6px 14px', textTransform: 'capitalize', fontSize: 12, borderRadius: 8 }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Fuel Type</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {FUELS.map(f => (
                        <button
                          key={f}
                          className={`btn btn-sm ${selectedFuel === f ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setSelectedFuel(f)}
                          style={{ padding: '6px 12px', textTransform: 'capitalize', fontSize: 12, borderRadius: 8 }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Cap Slider */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label className="form-label">Price Cap Slider</label>
                      <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', padding: 2, borderRadius: 6 }}>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Full-Width Car Cards Grid */}
          <section>
            {loading ? (
              <div className="grid-fleet-catalog">
                <CarSkeleton />
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
              <div className="grid-fleet-catalog">
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

          <style>{`
            .fleet-container {
              padding: 0 16px;
            }
            .grid-fleet-catalog {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
            }
            @media (min-width: 1600px) {
              .grid-fleet-catalog {
                grid-template-columns: repeat(5, 1fr);
                gap: 18px;
              }
            }
            @media (max-width: 1200px) {
              .grid-fleet-catalog {
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
              }
            }
            @media (max-width: 820px) {
              .grid-fleet-catalog {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
              }
            }
            @media (max-width: 520px) {
              .fleet-container {
                padding: 0 8px;
              }
              .grid-fleet-catalog {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
              }
            }
          `}</style>
        </div>
      </main>

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
