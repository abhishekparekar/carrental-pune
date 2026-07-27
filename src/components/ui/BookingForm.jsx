import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { addInquiry } from '../../firebase/firestore';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import TermsAndConditions from './TermsAndConditions';

export default function BookingForm({ car, onSuccess }) {
  const { tenantId } = useTenant();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    city: car?.citiesAvailable?.[0] || 'Mumbai',
    pickupDate: new Date(Date.now() + 86400000),
    returnDate: new Date(Date.now() + 86400000 * 3),
    pickupType: 'delivery',
    message: '',
  });

  const cities = ['Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    const diff = formData.returnDate.getTime() - formData.pickupDate.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
  };

  const daysCount = calculateDays();
  const estimatedPrice = car ? (car.pricePerDay || 1499) * daysCount : 0;

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required contact details');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please read and agree to the Terms & Conditions');
      return;
    }

    setSubmitting(true);
    try {
      await addInquiry(tenantId, {
        carId: car?.id || null,
        carName: car?.name || 'General Inquiry',
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
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
      console.error('Error submitting inquiry:', err);
      toast.error('Failed to submit inquiry. Please try again.');
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
          padding: '24px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--color-success-bg)',
          border: '1px solid rgba(16,185,129,0.3)',
          color: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
        }}>
          <FiCheckCircle />
        </div>
        <h3 style={{ fontSize: 20, margin: 0, color: 'var(--color-text)' }}>Inquiry Received!</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-2)', maxWidth: 320, margin: 0 }}>
          Thank you, <strong>{formData.customerName}</strong>. Our team will contact you at <strong>{formData.phone}</strong> shortly to confirm doorstep delivery.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <a
            href="/my-inquiries"
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            View My Booking Status ➔
          </a>
          <button
            type="button"
            onClick={() => { setSubmitted(false); }}
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            New Request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {car && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-accent-bg)',
          border: '1px solid rgba(255,87,34,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
              Selected Vehicle
            </span>
            <h4 style={{ fontSize: 14, margin: 0, color: 'var(--color-text)' }}>{car.name}</h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: 'var(--color-text-3)', display: 'block' }}>Est. Total ({daysCount}d)</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-accent)' }}>
              {formatCurrency(estimatedPrice)}
            </span>
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="grid-2" style={{ gap: 10 }}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="John Doe"
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone *</label>
          <input
            type="tel"
            required
            className="form-input"
            placeholder="+91 92707 62176"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid-2" style={{ gap: 10 }}>
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            required
            className="form-input"
            placeholder="john@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">City *</label>
          <select
            className="form-select"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
          >
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid-2" style={{ gap: 10 }}>
        <div className="form-group">
          <label className="form-label">Pickup Date & Time</label>
          <DatePicker
            selected={formData.pickupDate}
            onChange={date => setFormData({ ...formData, pickupDate: date })}
            showTimeSelect
            dateFormat="MMM d, h:mm aa"
            minDate={new Date()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Return Date & Time</label>
          <DatePicker
            selected={formData.returnDate}
            onChange={date => setFormData({ ...formData, returnDate: date })}
            showTimeSelect
            dateFormat="MMM d, h:mm aa"
            minDate={formData.pickupDate || new Date()}
          />
        </div>
      </div>

      {/* Pickup Type */}
      <div className="form-group">
        <label className="form-label">Delivery Option</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            type="button"
            className={`btn ${formData.pickupType === 'delivery' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFormData({ ...formData, pickupType: 'delivery' })}
            style={{ justifyContent: 'center' }}
          >
            🚗 Doorstep Delivery
          </button>
          <button
            type="button"
            className={`btn ${formData.pickupType === 'self-pickup' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFormData({ ...formData, pickupType: 'self-pickup' })}
            style={{ justifyContent: 'center' }}
          >
            🏢 Hub Self-Pickup
          </button>
        </div>
      </div>

      {/* Message */}
      <div className="form-group">
        <label className="form-label">Special Requests (Optional)</label>
        <textarea
          rows={2}
          className="form-textarea"
          placeholder="Any specific delivery instructions..."
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      {/* Terms & Conditions Section */}
      <TermsAndConditions compact={true} expandable={true} defaultOpen={false} />

      {/* Mandatory Terms Checkbox */}
      <label style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontSize: 12,
        fontWeight: 600,
        color: '#111318',
        cursor: 'pointer',
        background: agreedToTerms ? 'rgba(200,0,10,0.06)' : '#F9FAFB',
        border: agreedToTerms ? '1px solid rgba(200,0,10,0.25)' : '1px solid #E5E7EB',
        padding: '10px 12px',
        borderRadius: 10,
        transition: 'all 0.15s ease',
      }}>
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: '#C8000A', marginTop: 1, cursor: 'pointer' }}
        />
        <span>
          I agree to all <strong>SA Self Drive Terms & Conditions</strong> and carry the <strong>5 Required Documents</strong> (Aadhaar, Driving Licence, PAN Card, Rent Agreement & Job ID).
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting || !agreedToTerms}
        className="btn btn-primary btn-lg w-full"
        style={{ marginTop: 4, opacity: agreedToTerms ? 1 : 0.65 }}
      >
        {submitting ? 'Submitting...' : 'Submit Rental Inquiry'} <FiSend />
      </button>

      <p style={{ fontSize: 11, color: 'var(--color-text-3)', textAlign: 'center', margin: 0 }}>
        🔒 Carry 5 Required Documents (Aadhaar, DL, PAN, Rent Agreement & Job ID) at pickup.
      </p>
    </form>
  );
}
