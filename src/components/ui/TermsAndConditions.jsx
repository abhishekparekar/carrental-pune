import { useState } from 'react';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiChevronDown, FiChevronUp, FiFileText, FiClock, FiKey, FiDollarSign } from 'react-icons/fi';

export const REQUIRED_DOCUMENTS = [
  { id: 1, name: 'Aadhaar Card', icon: '🪪', req: 'Original Required' },
  { id: 2, name: 'Driving Licence', icon: '🚗', req: 'Valid Original' },
  { id: 3, name: 'PAN Card', icon: '💳', req: 'Original Required' },
  { id: 4, name: 'Rent Agreement', icon: '🏠', req: 'Current Address Proof' },
  { id: 5, name: 'Job ID Card', icon: '🆔', req: 'Employment Proof' },
];

export const CATEGORIZED_TERMS = [
  {
    category: 'Km & Overtime Rates',
    icon: '⚡',
    items: [
      { highlight: '300 km Limit', text: '300 km limit per 24 hours package.' },
      { highlight: 'Extra KM Rates', text: '₹6/km (5 Seater) • ₹7/km (7 Seater / SUV).' },
      { highlight: 'Overtime Fees', text: '₹200/hr (Swift, Ertiga, i20, Dzire, Punch, Venue, Baleno) • ₹300/hr (Thar 4x4).' },
    ],
  },
  {
    category: 'Deposit & Insurance',
    icon: '🔑',
    items: [
      { highlight: 'Security Deposit', text: "Customer's own bike is acceptable OR ₹10,000 cash deposit." },
      { highlight: 'Advance Fee', text: 'Booking advance payment is strictly Non-Refundable.' },
      { highlight: 'Damage Policy', text: 'Minor scratches & dents not covered by insurance. Service center downtime fee + processing fee applies.' },
    ],
  },
  {
    category: 'Privacy Policy & Data Security',
    icon: '🔒',
    items: [
      { highlight: 'ID Privacy', text: 'Submitted identity documents (Aadhaar/DL) are strictly used for rental verification only.' },
      { highlight: 'No Third-Party Sharing', text: 'Customer contact details and personal information are 100% confidential and never shared.' },
      { highlight: 'Deposit Safety', text: 'All security deposits and customer data are handled securely and transparently.' },
    ],
  },
  {
    category: 'Rules & Fuel Policy',
    icon: '🚫',
    items: [
      { highlight: 'Strict Policy', text: "DON'T DRINK AND DRIVE. 100% customer liability for damages if alcohol is involved." },
      { highlight: 'Fuel & FASTag', text: 'Maintain given fuel level (extra fuel non-refundable). FASTag server issues not under our control.' },
      { highlight: 'Pickup Payment', text: 'Full rent + deposit must be paid at the time of car pickup.' },
    ],
  },
];

export const HIGHLIGHT_CHIPS = [
  { text: '🔒 100% Privacy Protected', icon: '🛡️' },
  { text: '300 KM / 24h Limit', icon: '📏' },
  { text: 'Bike / ₹10k Deposit', icon: '🔑' },
  { text: '5 Required Documents', icon: '📄' },
  { text: 'No Drink & Drive', icon: '🚫' },
  { text: 'Non-Refundable Advance', icon: '💳' },
  { text: 'Rent at Pickup', icon: '🛻' },
];

export default function TermsAndConditions({ expandable = true, defaultOpen = false, compact = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      border: '1px solid rgba(200, 0, 10, 0.20)',
      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Top Banner Header - Clickable Toggle */}
      <div
        onClick={() => expandable && setIsOpen(prev => !prev)}
        style={{
          padding: compact ? '10px 14px' : '12px 18px',
          background: 'linear-gradient(135deg, rgba(200,0,10,0.06) 0%, rgba(248,250,252,1) 100%)',
          borderBottom: (isOpen || !expandable) ? '1px solid rgba(200,0,10,0.15)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: expandable ? 'pointer' : 'default',
          userSelect: 'none',
          transition: 'background 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #FF1E2D 0%, #C8000A 100%)',
            color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
            boxShadow: '0 2px 8px rgba(200,0,10,0.25)',
          }}>
            <FiShield />
          </div>
          <div>
            <h4 style={{ fontSize: compact ? 13 : 14.5, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Privacy Policy, Rental Rules & Documents</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#C8000A', background: 'rgba(200,0,10,0.08)', padding: '2px 8px', borderRadius: 99 }}>
                {isOpen ? 'Click to Collapse' : 'Click to Read'}
              </span>
            </h4>
            <span style={{ fontSize: 11, color: '#64748B', display: 'block', marginTop: 1 }}>
              Data privacy protection, Aadhaar & DL verification, 300 km daily limit & deposit
            </span>
          </div>
        </div>

        {expandable && (
          <div style={{
            width: 28, height: 28,
            borderRadius: '50%',
            background: isOpen ? '#C8000A' : 'rgba(200,0,10,0.08)',
            color: isOpen ? '#FFFFFF' : '#C8000A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
            transition: 'all 0.2s ease',
          }}>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        )}
      </div>

      {(!expandable || isOpen) && (
        <div style={{ padding: compact ? '12px 14px' : '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Quick Highlight Pills Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            {HIGHLIGHT_CHIPS.map((chip, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 99,
                  background: 'rgba(200,0,10,0.06)',
                  border: '1px solid rgba(200,0,10,0.18)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#C8000A',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>{chip.icon}</span>
                <span>{chip.text}</span>
              </div>
            ))}
          </div>

          {/* Notice Alert Box */}
          <div style={{
            padding: '8px 12px',
            borderRadius: 10,
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            fontSize: 11.5,
            color: '#991B1B',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <FiAlertTriangle size={15} style={{ flexShrink: 0, color: '#DC2626' }} />
            <span>⭕ PLEASE READ ALL TERMS AND CONDITIONS CAREFULLY BEFORE BOOKING ⭕</span>
          </div>

          {/* 📄 MANDATORY DOCUMENTS REQUIRED CARD */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(200, 0, 10, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
            border: '1px solid rgba(200, 0, 10, 0.22)',
            borderRadius: 12,
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>📄</span>
              <strong style={{ fontSize: 13, color: '#C8000A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                5 Documents Required for Pickup:
              </strong>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 8,
            }}>
              {REQUIRED_DOCUMENTS.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 10,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{doc.icon}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: 12, color: '#111318', lineHeight: 1.2 }}>
                      {doc.id}) {doc.name}
                    </strong>
                    <span style={{ fontSize: 10, color: '#6B7080' }}>{doc.req}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Column Policy Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 10,
          }}>
            {CATEGORIZED_TERMS.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  background: '#F9FAFB',
                  borderRadius: 12,
                  padding: '12px 14px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 6, borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: 15 }}>{cat.icon}</span>
                  <strong style={{ fontSize: 12.5, color: '#111318', fontWeight: 800 }}>{cat.category}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ fontSize: 11.5, lineHeight: 1.45, color: '#4B5563' }}>
                      <strong style={{ color: '#C8000A', fontWeight: 700 }}>• {item.highlight}: </strong>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Security Note */}
          <div style={{
            padding: '8px 12px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(200,0,10,0.05) 0%, rgba(255,255,255,1) 100%)',
            border: '1px dashed rgba(200,0,10,0.25)',
            fontSize: 11.5,
            color: '#111318',
            textAlign: 'center',
            fontWeight: 600,
          }}>
            🛻 <strong>Full rent + deposit (bike or ₹10,000)</strong> collected at car pickup.
          </div>
        </div>
      )}
    </div>
  );
}
