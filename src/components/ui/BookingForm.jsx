import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle, FiMapPin, FiTruck, FiKey } from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { addInquiry, subscribeToCars } from '../../firebase/firestore';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import TermsAndConditions from './TermsAndConditions';

export default function BookingForm({ car, onSuccess }) {
  const { tenantId } = useTenant();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fleetCars, setFleetCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    city: car?.citiesAvailable?.[0] || 'Pune',
    pickupDate: new Date(Date.now() + 86400000),
    returnDate: new Date(Date.now() + 86400000 * 3),
    pickupType: 'delivery',
    message: '',
  });

  useEffect(() => {
    if (car) return;
    const unsub = subscribeToCars(tenantId, (data) => {
      setFleetCars(data || []);
      if (data && data.length > 0) {
        setSelectedCarId(prev => prev || data[0].id);
      }
    });
    return () => unsub();
  }, [tenantId, car]);

  const cities = ['Pune', 'Mumbai', 'Pimpri-Chinchwad', 'Lonavala', 'Outstation'];

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    const diff = formData.returnDate.getTime() - formData.pickupDate.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
  };

  const daysCount = calculateDays();
  const activeCar = car || fleetCars.find(c => c.id === selectedCarId) || fleetCars[0] || null;
  const estimatedPrice = activeCar ? (activeCar.pricePerDay || 2500) * daysCount : 0;

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.phone.trim()) {
      toast.error('Please fill in required contact details');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please check the Terms & Conditions box to proceed');
      return;
    }

    setSubmitting(true);
    try {
      const targetCar = car || activeCar;
      await addInquiry(tenantId, {
        carId: targetCar?.id || null,
        carName: targetCar?.name || 'General Inquiry',
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email || 'N/A',
        city: formData.city,
        pickupDate: formData.pickupDate.toISOString(),
        returnDate: formData.returnDate.toISOString(),
        pickupType: formData.pickupType,
        message: formData.message,
        estimatedPrice,
        daysCount,
      }, user?.uid || 'guest');

      setSubmitted(true);
      toast.success('Rental Inquiry submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: 'center',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(22,163,74,0.1)',
          color: '#16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FiCheckCircle size={24} />
        </div>

        <h3 style={{ fontSize: 18, margin: 0, color: '#0F172A', fontWeight: 900 }}>Inquiry Received!</h3>
        <p style={{ fontSize: 12.5, color: '#64748B', maxWidth: 360, margin: 0, lineHeight: 1.5 }}>
          Thank you! Our representative will confirm vehicle availability and doorstep delivery within 15 minutes.
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <a
            href="/my-inquiries"
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 14px', fontSize: 12, background: '#C8000A', borderColor: '#C8000A', fontWeight: 800 }}
          >
            Track Status ➔
          </a>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            New Request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Selected Vehicle Banner / Selector */}
      {!car ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="form-label" style={{ fontSize: 11, marginBottom: 2 }}>Select Vehicle Model *</label>
              {activeCar && (
                <span style={{ fontSize: 11, color: '#C8000A', fontWeight: 800 }}>
                  Est. {formatCurrency(estimatedPrice)} ({daysCount} {daysCount === 1 ? 'day' : 'days'})
                </span>
              )}
            </div>
            <select
              className="form-select"
              value={selectedCarId || activeCar?.id || ''}
              onChange={e => setSelectedCarId(e.target.value)}
              style={{ fontWeight: 800, height: 40, fontSize: 13.5 }}
            >
              {fleetCars.length === 0 ? (
                <option value="">Loading fleet cars from database...</option>
              ) : (
                fleetCars.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {formatCurrency(c.pricePerDay || 2500)}/day
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '8px 12px',
          borderRadius: 10,
          background: 'rgba(200, 0, 10, 0.05)',
          border: '1px solid rgba(200, 0, 10, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: 10, color: '#C8000A', fontWeight: 800, textTransform: 'uppercase' }}>
              Selected Car
            </span>
            <h4 style={{ fontSize: 14, margin: 0, color: '#0F172A', fontWeight: 800 }}>{car.name}</h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: '#64748B', display: 'block' }}>Est. Total ({daysCount}d)</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#C8000A' }}>
              {formatCurrency(estimatedPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Row 1: Contact Details */}
      <div className="booking-fields-row" style={{ display: 'grid', gap: 10 }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11, marginBottom: 2 }}>Full Name *</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="Enter your full name"
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            style={{ height: 38, fontSize: 13 }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11, marginBottom: 2 }}>Mobile Number (+91) *</label>
          <input
            type="tel"
            required
            className="form-input"
            placeholder="Enter 10-digit mobile number"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            style={{ height: 38, fontSize: 13 }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11, marginBottom: 2 }}>City / Location</label>
          <select
            className="form-select"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            style={{ height: 38, fontSize: 13 }}
          >
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2: Trip Dates & Delivery Option */}
      <div className="booking-fields-row" style={{ display: 'grid', gap: 10 }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11, marginBottom: 2 }}>Pickup Date & Time</label>
          <DatePicker
            selected={formData.pickupDate}
            onChange={date => setFormData({ ...formData, pickupDate: date })}
            showTimeSelect
            dateFormat="MMM d, h:mm aa"
            minDate={new Date()}
            className="form-input"
            style={{ height: 38, fontSize: 13 }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11, marginBottom: 2 }}>Return Date & Time</label>
          <DatePicker
            selected={formData.returnDate}
            onChange={date => setFormData({ ...formData, returnDate: date })}
            showTimeSelect
            dateFormat="MMM d, h:mm aa"
            minDate={formData.pickupDate || new Date()}
            className="form-input"
            style={{ height: 38, fontSize: 13 }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11, marginBottom: 2 }}>Delivery Preference</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, height: 38 }}>
            <button
              type="button"
              className={`btn ${formData.pickupType === 'delivery' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFormData({ ...formData, pickupType: 'delivery' })}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '0 6px',
                justifyContent: 'center',
                background: formData.pickupType === 'delivery' ? '#C8000A' : '#FFFFFF',
                borderColor: formData.pickupType === 'delivery' ? '#C8000A' : '#CBD5E1',
              }}
            >
              <FiTruck size={12} /> Doorstep
            </button>
            <button
              type="button"
              className={`btn ${formData.pickupType === 'self-pickup' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFormData({ ...formData, pickupType: 'self-pickup' })}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '0 6px',
                justifyContent: 'center',
                background: formData.pickupType === 'self-pickup' ? '#C8000A' : '#FFFFFF',
                borderColor: formData.pickupType === 'self-pickup' ? '#C8000A' : '#CBD5E1',
              }}
            >
              <BsCarFront size={12} /> Hub Pickup
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Terms Checkbox */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11.5,
        fontWeight: 600,
        color: '#1E293B',
        cursor: 'pointer',
        background: agreedToTerms ? 'rgba(200,0,10,0.05)' : '#F8FAFC',
        border: agreedToTerms ? '1px solid rgba(200,0,10,0.25)' : '1px solid #E2E8F0',
        padding: '8px 10px',
        borderRadius: 8,
        marginTop: 2,
      }}>
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: '#C8000A', cursor: 'pointer' }}
        />
        <span>
          I agree to <strong>Terms & Conditions</strong> & carry <strong>5 Required Documents</strong> (Aadhaar, DL, PAN, Rent Agreement & Job ID).
        </span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !agreedToTerms}
        className="btn btn-primary btn-lg w-full"
        style={{
          background: '#C8000A',
          borderColor: '#C8000A',
          fontSize: 13.5,
          fontWeight: 800,
          padding: '9px',
          opacity: agreedToTerms ? 1 : 0.65,
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {submitting ? 'Submitting...' : <><FiSend size={14} /> Submit Rental Inquiry</>}
      </button>
    </form>
  );
}
