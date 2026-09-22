import { useState } from 'react';
import {
  FiShield,
  FiLock,
  FiFileText,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiZap,
} from 'react-icons/fi';

export const REQUIRED_DOCUMENTS = [
  { name: 'Aadhaar Card', icon: '🪪', desc: 'Identity Proof' },
  { name: 'Driving Licence', icon: '🚗', desc: 'Valid Original' },
  { name: 'PAN Card', icon: '💳', desc: 'Original Card' },
  { name: 'Address Proof', icon: '🏠', desc: 'Rent/Home Proof' },
  { name: 'Job / Work ID', icon: '🆔', desc: 'Employment Proof' },
];

export const POLICY_SECTIONS = [
  {
    id: 'privacy',
    title: 'Privacy Policy & Data Security',
    icon: <FiLock size={14} color="#C8000A" />,
    badge: '100% Confidential',
    shortTab: 'Privacy & Data',
    items: [
      { label: 'Document Privacy', text: 'All submitted identity proofs (Aadhaar & DL) are encrypted and strictly used for rental verification.' },
      { label: 'No Third-Party Sharing', text: 'Customer personal details and contact numbers are never shared or sold to external advertisers.' },
      { label: 'Safe Transactions', text: 'All deposits and rental transactions are recorded with clear receipts and refunded promptly on return.' },
    ],
  },
  {
    id: 'rules',
    title: 'Rental Rules & 300 KM Policy',
    icon: <FiZap size={14} color="#C8000A" />,
    badge: 'Standard Package',
    shortTab: 'Rental Rules',
    items: [
      { label: '300 KM/Day Limit', text: 'Every 24-hour rental includes 300 km daily limit. Extra distance: ₹6/km (5-seater), ₹7/km (7-seater).' },
      { label: 'Overtime Grace', text: '30 minutes complimentary grace period. Subsequent overtime: ₹200/hr (standard cars) to ₹300/hr (Thar).' },
      { label: 'Zero Tolerance', text: "Strict DON'T DRINK AND DRIVE policy. 100% client legal & financial liability if alcohol is involved." },
    ],
  },
  {
    id: 'deposit',
    title: 'Deposit & Handover Guidelines',
    icon: <FiShield size={14} color="#C8000A" />,
    badge: 'Refundable Security',
    shortTab: 'Security Deposit',
    items: [
      { label: 'Deposit Options', text: "Customer's own 2-wheeler handover OR standard cash/online deposit, refunded immediately on return." },
      { label: 'Payment on Handover', text: 'Full trip rental fee and refundable deposit are collected at car delivery time.' },
      { label: 'Fuel Handover', text: 'Vehicles must be returned at the same fuel level as dispatched at handover.' },
    ],
  },
];

export default function TermsAndConditions({ expandable = true, defaultOpen = false, compact = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="terms-root-container">
      {/* ── Top Clickable Toggle Header ── */}
      <button
        type="button"
        onClick={() => expandable && setIsOpen(prev => !prev)}
        className="terms-header-toggle"
        aria-expanded={isOpen}
      >
        <div className="terms-header-left">
          <div className="terms-shield-icon">
            <FiShield size={16} />
          </div>
          <div className="terms-header-text">
            <div className="terms-title-line">
              <span className="terms-title-main">Privacy Policy & Rental Guidelines</span>
              <span className="terms-status-badge">
                {isOpen ? 'Collapse' : 'Click to Read'}
              </span>
            </div>
            <span className="terms-subtitle">
              100% Data Confidentiality • 5 Mandatory ID Proofs • 300 KM Daily Allowance
            </span>
          </div>
        </div>

        {expandable && (
          <div className={`terms-chevron-wrap ${isOpen ? 'open' : ''}`}>
            {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </div>
        )}
      </button>

      {/* ── Expandable Body ── */}
      {(!expandable || isOpen) && (
        <div className="terms-body-content">

          {/* 1. Mandatory Documents Compact Strip */}
          <div className="terms-docs-box">
            <div className="terms-box-heading">
              <FiFileText size={13} color="#C8000A" />
              <span>5 Mandatory Documents for Vehicle Handover:</span>
            </div>

            <div className="terms-docs-grid">
              {REQUIRED_DOCUMENTS.map((doc, idx) => (
                <div key={idx} className="terms-doc-pill">
                  <span className="terms-doc-emoji">{doc.icon}</span>
                  <div className="terms-doc-info">
                    <strong className="terms-doc-name">{doc.name}</strong>
                    <span className="terms-doc-desc">{doc.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Interactive Segmented Tabs (Mobile-friendly toggle) */}
          <div className="terms-tab-bar">
            {POLICY_SECTIONS.map((sec, idx) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`terms-tab-btn ${activeTab === idx ? 'active' : ''}`}
              >
                {sec.icon}
                <span>{sec.shortTab}</span>
              </button>
            ))}
          </div>

          {/* 3. Active Policy Card Content (Compact & Focused) */}
          <div className="terms-single-policy-card">
            <div className="terms-policy-header">
              <div className="terms-policy-title-wrap">
                {POLICY_SECTIONS[activeTab].icon}
                <h5 className="terms-policy-title">{POLICY_SECTIONS[activeTab].title}</h5>
              </div>
              <span className="terms-policy-tag">{POLICY_SECTIONS[activeTab].badge}</span>
            </div>

            <ul className="terms-policy-list">
              {POLICY_SECTIONS[activeTab].items.map((item, itemIdx) => (
                <li key={itemIdx} className="terms-policy-item">
                  <strong className="terms-policy-label">• {item.label}: </strong>
                  <span className="terms-policy-desc">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Desktop View: All 3 Policy Cards Side-by-Side */}
          <div className="terms-policies-desktop-grid">
            {POLICY_SECTIONS.map((sec, idx) => (
              <div key={idx} className="terms-policy-card">
                <div className="terms-policy-header">
                  <div className="terms-policy-title-wrap">
                    {sec.icon}
                    <h5 className="terms-policy-title">{sec.title}</h5>
                  </div>
                  <span className="terms-policy-tag">{sec.badge}</span>
                </div>

                <ul className="terms-policy-list">
                  {sec.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="terms-policy-item">
                      <strong className="terms-policy-label">• {item.label}: </strong>
                      <span className="terms-policy-desc">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 5. Bottom Safe Handover Guarantee Banner */}
          <div className="terms-footer-notice">
            <FiCheckCircle size={13} color="#16A34A" style={{ flexShrink: 0 }} />
            <span>
              <strong>100% Transparent Handover:</strong> Sanitized car delivery with pre-trip video inspection.
            </span>
          </div>

        </div>
      )}

      <style>{`
        .terms-root-container {
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          width: 100%;
          transition: border-color 0.2s ease;
        }
        .terms-root-container:hover {
          border-color: rgba(200, 0, 10, 0.25);
        }

        .terms-header-toggle {
          width: 100%;
          padding: 10px 14px;
          background: linear-gradient(135deg, rgba(200, 0, 10, 0.04) 0%, #FFFFFF 100%);
          border: none;
          border-bottom: ${isOpen || !expandable ? '1px solid #F1F5F9' : 'none'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: ${expandable ? 'pointer' : 'default'};
          text-align: left;
          gap: 10px;
          transition: background 0.18s ease;
        }
        .terms-header-toggle:hover {
          background: linear-gradient(135deg, rgba(200, 0, 10, 0.07) 0%, #F8FAFC 100%);
        }

        .terms-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .terms-shield-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #FF1E2D 0%, #C8000A 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(200, 0, 10, 0.25);
        }

        .terms-header-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .terms-title-line {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .terms-title-main {
          font-size: 13.5px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.01em;
        }

        .terms-status-badge {
          font-size: 10px;
          font-weight: 750;
          color: #C8000A;
          background: rgba(200, 0, 10, 0.08);
          padding: 1.5px 7px;
          border-radius: 99px;
          border: 1px solid rgba(200, 0, 10, 0.18);
        }

        .terms-subtitle {
          font-size: 11px;
          color: #64748B;
          font-weight: 550;
          line-height: 1.25;
        }

        .terms-chevron-wrap {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F1F5F9;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .terms-chevron-wrap.open {
          background: #C8000A;
          color: #FFFFFF;
        }

        .terms-body-content {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #FAFAFC;
        }

        /* ── Documents Compact Box ── */
        .terms-docs-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .terms-box-heading {
          font-size: 11px;
          font-weight: 800;
          color: #C8000A;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .terms-docs-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 6px;
        }

        .terms-doc-pill {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .terms-doc-emoji {
          font-size: 14px;
          flex-shrink: 0;
        }

        .terms-doc-info {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
          min-width: 0;
        }

        .terms-doc-name {
          font-size: 11px;
          color: #0F172A;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .terms-doc-desc {
          font-size: 9px;
          color: #64748B;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Segmented Tab Bar (Hidden on desktop, active on mobile/tablet) ── */
        .terms-tab-bar {
          display: none;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 4px;
          background: #E2E8F0;
          padding: 3px;
          border-radius: 9px;
        }

        .terms-tab-btn {
          background: transparent;
          border: none;
          border-radius: 7px;
          padding: 6px 4px;
          font-size: 10.5px;
          font-weight: 750;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .terms-tab-btn.active {
          background: #FFFFFF;
          color: #C8000A;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        /* ── Single Card View for Mobile/Tablet ── */
        .terms-single-policy-card {
          display: none;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
          flex-direction: column;
          gap: 6px;
        }

        /* ── Policy Sections Desktop Grid ── */
        .terms-policies-desktop-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .terms-policy-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .terms-policy-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 6px;
          border-bottom: 1px solid #F1F5F9;
          gap: 6px;
        }

        .terms-policy-title-wrap {
          display: flex;
          align-items: center;
          gap: 5px;
          min-width: 0;
        }

        .terms-policy-title {
          font-size: 11.5px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .terms-policy-tag {
          font-size: 9px;
          font-weight: 750;
          color: #16A34A;
          background: #DCFCE7;
          padding: 1.5px 5px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .terms-policy-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .terms-policy-item {
          font-size: 11px;
          line-height: 1.4;
          color: #334155;
        }

        .terms-policy-label {
          color: #0F172A;
          font-weight: 750;
        }

        .terms-policy-desc {
          color: #475569;
          font-weight: 550;
        }

        /* ── Footer Notice ── */
        .terms-footer-notice {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 11px;
          color: #166534;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.35;
        }

        /* ── Tablet & Mobile Breakpoints ── */
        @media (max-width: 900px) {
          .terms-docs-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .terms-policies-desktop-grid {
            display: none;
          }
          .terms-tab-bar {
            display: grid;
          }
          .terms-single-policy-card {
            display: flex;
          }
        }

        @media (max-width: 640px) {
          .terms-header-toggle {
            padding: 8px 10px;
          }
          .terms-title-main {
            font-size: 12.5px;
          }
          .terms-subtitle {
            font-size: 10px;
          }
          .terms-body-content {
            padding: 8px 10px;
            gap: 8px;
          }
          .terms-docs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 5px;
          }
          .terms-doc-pill {
            padding: 5px 6px;
          }
          .terms-doc-name {
            font-size: 10.5px;
          }
          .terms-doc-desc {
            font-size: 8.5px;
          }
          .terms-tab-btn {
            font-size: 9.5px;
            padding: 5px 2px;
          }
          .terms-single-policy-card {
            padding: 8px 10px;
          }
          .terms-policy-title {
            font-size: 11px;
          }
          .terms-policy-item {
            font-size: 10.5px;
            line-height: 1.35;
          }
          .terms-footer-notice {
            font-size: 10px;
            padding: 5px 8px;
          }
        }

        @media (max-width: 380px) {
          .terms-tab-btn span {
            font-size: 9px;
          }
          .terms-docs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
