import React from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Mail, Clock, Calendar } from 'lucide-react';

const EmailSetting = ({
  email,
  setEmail,
  numberOfDayAhead,
  setNumberOfDayAhead,
  reminderTime,
  setReminderTime,
  disabled,
  hasUnsavedChanges,
  onSave,
  onTestEmail,
  appBarColor,
}) => {
  const { t } = useTranslation();

  // Determine text color based on branding (Sunlife yellow case)
  const isYellow = appBarColor === '#FFCD00';
  const buttonTextColor = isYellow ? '#003946' : '#ffffff';

  // Common Label Style
  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569', // slate-600
    marginBottom: '6px'
  };

  // Common Input Style
  const inputStyle = {
    width: '100%',
    padding: '10px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#1e293b', // slate-800
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          {t('emailSetting.title')}
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Email Field (Read Only) */}
        <div>
          <label style={labelStyle}>
            <Mail size={14} /> {t('emailSetting.email')}
          </label>
          <input
            type="email"
            value={email}
            readOnly
            disabled
            style={{ 
              ...inputStyle, 
              backgroundColor: '#f8fafc', 
              color: '#64748b', 
              cursor: 'not-allowed',
              border: '1px solid #e2e8f0'
            }}
          />
        </div>

        {/* Number of Days Ahead Selection */}
        <div>
          <label style={labelStyle}>
            <Calendar size={14} /> {t('emailSetting.numberOfDaysAhead')}
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={numberOfDayAhead}
              disabled={disabled}
              onChange={(e) => setNumberOfDayAhead(Number(e.target.value))}
              style={{ 
                ...inputStyle,
                appearance: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i} style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>
                  {i} {i === 1 ? 'Day' : 'Days'}
                </option>
              ))}
            </select>
            {/* Custom Arrow for Select */}
            <div style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              pointerEvents: 'none',
              color: '#94a3b8'
            }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Reminder Time Input */}
        <div>
          <label style={labelStyle}>
            <Clock size={14} /> {t('emailSetting.reminderTime')}
          </label>
          <input
            type="time"
            step="300"
            value={reminderTime}
            disabled={disabled}
            onChange={(e) => setReminderTime(e.target.value)}
            style={{ 
              ...inputStyle,
              cursor: disabled ? 'not-allowed' : 'text'
            }}
          />
        </div>

        {/* Update Button */}
        <div style={{ paddingTop: '8px' }}>
          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              backgroundColor: hasUnsavedChanges ? appBarColor : '#f1f5f9',
              color: hasUnsavedChanges ? buttonTextColor : '#94a3b8',
              boxShadow: hasUnsavedChanges ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Save size={18} />
            {t('emailSetting.updateButton')}
          </button>
          
          {!hasUnsavedChanges && (
            <p style={{ 
              textAlign: 'center', 
              fontSize: '10px', 
              color: '#94a3b8', 
              marginTop: '8px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              fontWeight: '600'
            }}>
              Settings up to date
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailSetting;