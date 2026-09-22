import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiRefreshCw, FiSearch, FiSliders, FiCheck, FiZap, FiTruck } from 'react-icons/fi';
import { BsCarFront, BsCarFrontFill } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars } from '../../firebase/firestore';
import { Helmet } from 'react-helmet-async';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Fleet', icon: <BsCarFront size={15} /> },
  { id: 'popular', label: 'Popular Choice', icon: <FiZap size={15} style={{ color: '#C8000A' }} /> },
  { id: 'hatchback', label: 'Hatchback (Swift, i20, Baleno)', icon: <BsCarFront size={15} /> },
  { id: 'sedan', label: 'Sedan & CNG (Dzire)', icon: <BsCarFrontFill size={15} /> },
  { id: 'suv', label: 'SUV & 4x4 (Thar, Punch, Venue)', icon: <FiTruck size={15} /> },
  { id: 'muv', label: '7-Seater MUV (Ertiga)', icon: <BsCarFront size={15} /> },
];

export default function FleetPage() {
  const { tenantId } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const unsub = subscribeToCars(tenantId, (data) => {
      setCars(data);
      setLoading(false);
    });
    return () => unsub();
  }, [tenantId]);

  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    setSearchParams(params, { replace: true });
  }, [selectedCategory]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      if (selectedCategory === 'popular') return car.isPopular !== false;
      if (selectedCategory !== 'all' && car.category !== selectedCategory) return false;
      return true;
    });
  }, [cars, selectedCategory]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--gradient-page-bg)' }}>
      <Helmet>
        <title>Self Drive Car Rental Fleet Pune | Rent Swift, Thar, Ertiga, Creta | SA Self Drive</title>
        <meta name="title" content="Self Drive Car Rental Fleet Pune | Rent Swift, Thar, Ertiga, Creta | SA Self Drive" />
        <meta name="description" content="Explore sanitized self drive cars in Pune. Rent Hatchbacks, Sedans, 7-Seater Ertiga, Creta & Thar 4x4 with 300 KM daily allowance and doorstep delivery in Pune & PCMC." />
        <link rel="canonical" href="https://www.saselfdrivecar.com/fleet" />
      </Helmet>
      <Navbar />

      <main style={{ paddingTop: 76, paddingBottom: 44, flex: 1 }}>
        
        {/* Sleek Gradient Header */}
        <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0', marginBottom: 24, padding: '28px 0 20px' }}>
          <div className="fleet-container">
            <span className="section-label-red" style={{ marginBottom: 6 }}>
              SA Self Drive Fleet
            </span>
            <h1 className="section-title" style={{ fontSize: 'clamp(22px, 4vw, 34px)', margin: '0 0 6px' }}>
              Explore Available <span>Self-Drive Cars</span>
            </h1>
            <p className="section-desc" style={{ fontSize: 14, margin: 0 }}>
              Sanitized vehicles with 300 km daily allowance & doorstep delivery across Pune & PCMC.
            </p>
          </div>
        </div>

        <div className="fleet-container" style={{ width: '100%' }}>

          {/* Touch-Friendly Category Filter Pills Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 16,
            marginBottom: 12,
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {CATEGORY_TABS.map(tab => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 99,
                    background: isActive ? 'var(--gradient-accent-btn)' : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid #E2E8F0',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 16px rgba(200,0,10,0.35)' : '0 2px 6px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
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
                  background: 'rgba(200,0,10,0.08)',
                  border: '1px solid rgba(200,0,10,0.2)',
                  color: '#C8000A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <BsCarFront size={28} />
                </div>
                <h3 className="text-gradient-dark" style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>
                  No Cars Found in This Category
                </h3>
                <p style={{ fontSize: 13, color: '#1E293B', fontWeight: 600, maxWidth: 420, margin: '0 auto 16px', lineHeight: 1.5 }}>
                  Select "All Fleet" to view all available self-drive rental cars.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)' }}
                >
                  Show All Cars ➔
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
              width: 100%;
              max-width: 1560px;
              margin: 0 auto;
              padding: 0 clamp(16px, 2.5vw, 36px);
              box-sizing: border-box;
            }
            .grid-fleet-catalog {
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: clamp(14px, 1.8vw, 22px);
            }
            @media (min-width: 1600px) {
              .grid-fleet-catalog {
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 24px;
              }
            }
            @media (max-width: 1280px) {
              .grid-fleet-catalog {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 16px;
              }
            }
            @media (max-width: 900px) {
              .fleet-container {
                padding: 0 12px;
              }
              .grid-fleet-catalog {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px;
              }
            }
            @media (max-width: 580px) {
              .fleet-container {
                padding: 0 10px;
              }
              .grid-fleet-catalog {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
              }
            }
            @media (max-width: 360px) {
              .fleet-container {
                padding: 0 6px;
              }
              .grid-fleet-catalog {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 6px;
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
