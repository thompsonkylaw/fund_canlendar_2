import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import Setting from './Setting';

function LanguageSwitch({ setAppBarColor, setCompany, appBarColor, onTestEmail }) {
  const { i18n } = useTranslation();
  // Default to HK if language is 'en' or undefined to ensure UI consistency
  const [selectedLanguage, setSelectedLanguage] = useState(
    (i18n.language === 'en' ? 'zh-HK' : i18n.language) || 'zh-HK'
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // Inline styling for the toggle buttons
  const getButtonStyle = (lang) => {
    const isActive = selectedLanguage === lang;
    return {
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: isActive ? appBarColor : 'transparent',
      color: isActive ? '#ffffff' : '#64748b', // White vs Slate-500
      boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
      minWidth: '80px' // Ensure uniform width
    };
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Toggle Switch Container */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#f1f5f9', 
          padding: '4px', 
          borderRadius: '99px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => handleLanguageChange('zh-HK')}
            style={getButtonStyle('zh-HK')}
          >
            繁體
          </button>
          <button
            onClick={() => handleLanguageChange('zh-CN')}
            style={getButtonStyle('zh-CN')}
          >
            简体
          </button>
        </div>

        {/* Gear Icon Button */}
        <button
          onClick={() => setSettingsOpen(true)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        >
          <SettingsIcon sx={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Custom Modal Overlay (Replaces MUI Dialog) */}
      {settingsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          backdropFilter: 'blur(2px)' // Modern glass effect
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSettingsOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '4px'
              }}
            >
              <CloseIcon sx={{ fontSize: 24 }} />
            </button>

            {/* Modal Content - Padding handled here */}
            <div style={{ padding: '24px' }}>
              <Setting 
                setAppBarColor={setAppBarColor} 
                setCompany={setCompany} 
                onClose={() => setSettingsOpen(false)} 
                onTestEmail={onTestEmail} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Animation for Modal */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

export default LanguageSwitch;