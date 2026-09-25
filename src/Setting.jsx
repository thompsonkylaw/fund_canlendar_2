import React from 'react';
import { useTranslation } from 'react-i18next';

const Setting = ({ setAppBarColor, setCompany, onClose, onTestEmail }) => {
  const { t } = useTranslation();

  const companyToColor = {
    "Manulife": '#009739',
    "AIA": '#E4002B',
    "Sunlife": '#FFCD00',
    "AXA": '#00008F',
    "Chubb": '#004A9F',
    "Prudential": '#ed1b2e',
    "FWD": '#e67e22',
  };

  // Create a reverse mapping for lookup
  const colorToCompany = Object.entries(companyToColor).reduce((acc, [company, color]) => {
    acc[color] = company;
    return acc;
  }, {});

  // FWD color '#e67e22' was missing in original list; kept original list logic
  const colors = ['#009739', '#E4002B', '#FFCD00', '#00008F', '#004A9F', '#ed1b2e']; 

  const handleColorSelect = (color) => {
    setAppBarColor(color);
    const company = colorToCompany[color];
    if (company) {
      setCompany(company);
    }
    onClose();
  };

  // --- Environment & Whitelist Logic ---
  const IsProduction = window.root4appSettings?.IsProduction || false;
  const whitelist = [import.meta.env.VITE_ADMIN_1_EMAIL, import.meta.env.VITE_ADMIN_2_EMAIL];
  const whitelisted = whitelist.includes(window.root4appSettings?.user_email);

  console.log("IsProduction=", window.root4appSettings?.IsProduction);
  console.log("logged in user email=", window.root4appSettings?.user_email);
  console.log("whitelisted=", whitelisted);
  
  const domain = window.root4appSettings?.domain || false;
  console.log("domain=", domain);

  // Condition to show color picker
  const showColorPicker = whitelisted || !IsProduction || window.location.hostname.includes('tool');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div style={{ paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          {t('settings')} 
          <span style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '9999px' }}>v2.0.0</span>
        </h2>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Color Buttons Grid */}
        {showColorPicker && (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('Theme Color', 'Theme Color')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  style={{
                    backgroundColor: color,
                    color: color === '#FFCD00' ? '#0f172a' : '#ffffff', // Dark text for yellow, white for others
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'transform 0.1s ease, box-shadow 0.1s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test Email Button */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
          <button
            onClick={onTestEmail}
            style={{ 
              padding: '10px 24px', 
              borderRadius: '8px', 
              border: '1px solid #ec4899', // pink-500
              color: '#db2777', // pink-600
              fontWeight: '600', 
              backgroundColor: 'transparent',
              cursor: 'pointer',
              width: '100%',
              maxWidth: 'fit-content',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fdf2f8'} // pink-50
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {t('testEmailButton')}
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9' }}>
        <button
          onClick={onClose}
          style={{ 
            padding: '8px 16px', 
            color: '#64748b', // slate-500
            fontWeight: '500', 
            backgroundColor: 'transparent', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};

export default Setting;