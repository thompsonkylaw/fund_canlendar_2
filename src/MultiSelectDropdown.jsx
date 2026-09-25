import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDown, 
  X, 
  Check, 
  ListFilter 
} from 'lucide-react';

const MultiSelectDropdown = ({ selectedItems = [], onChange, appBarColor = '#1976d2' }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const funds = [
    '聯博 - 美元收益基金 AA',
    '安聯收益及增長基金AM類 （H2-歐元對沖）收息',
    '富蘭克林入息基金',
    '測試基金',
  ];

  // Helper to create "softer" version of the theme color
  const getSoftColorStyle = (hex) => {
    // Basic hex to rgba conversion for 10% opacity background
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return {
          backgroundColor: `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, 0.1)`,
          color: hex, // Text keeps the strong theme color
          border: `1px solid rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, 0.2)`
        };
    }
    // Fallback if invalid hex
    return { backgroundColor: '#eff6ff', color: '#1d4ed8' };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (fund) => {
    const currentIndex = selectedItems.indexOf(fund);
    const newChecked = [...selectedItems];

    if (currentIndex === -1) {
      newChecked.push(fund);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    // Mimic the event object expected by the parent
    onChange({ target: { value: newChecked } });
  };

  const removeItem = (e, fund) => {
    e.stopPropagation(); // Prevent dropdown toggle when clicking remove
    const newChecked = selectedItems.filter((item) => item !== fund);
    onChange({ target: { value: newChecked } });
  };

  const bubbleStyle = getSoftColorStyle(appBarColor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} ref={dropdownRef}>
      
      {/* Header with Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <div style={{ 
          padding: '8px', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <ListFilter size={20} color="#475569" />
        </div>
        <label style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>
          {t('selectFunds')}
        </label>
      </div>

      {/* Custom Dropdown Trigger */}
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            minHeight: '56px',
            backgroundColor: '#ffffff',
            border: isOpen ? `2px solid ${appBarColor}` : '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isOpen ? `0 0 0 4px ${bubbleStyle.backgroundColor}` : '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          {/* Selected Bubbles Area */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
            {selectedItems.length === 0 ? (
              <span style={{ color: '#94a3b8', fontSize: '15px' }}>{t('select_placeholder', 'Choose funds...')}</span>
            ) : (
              selectedItems.map((item) => (
                <span
                  key={item}
                  style={{
                    ...bubbleStyle,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  {item}
                  <div
                    onClick={(e) => removeItem(e, item)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      padding: '2px',
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }}
                  >
                    <X size={12} strokeWidth={3} />
                  </div>
                </span>
              ))
            )}
          </div>

          {/* Arrow Icon */}
          <div style={{ marginLeft: '8px', color: '#64748b' }}>
            <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            zIndex: 50,
            maxHeight: '300px',
            overflowY: 'auto',
            animation: 'fadeIn 0.1s ease-out'
          }}>
            {funds.map((fund) => {
              const isSelected = selectedItems.includes(fund);
              return (
                <div
                  key={fund}
                  onClick={() => handleToggle(fund)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isSelected ? bubbleStyle.backgroundColor : 'transparent',
                    color: isSelected ? appBarColor : '#334155',
                    fontWeight: isSelected ? '600' : '400',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '15px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{fund}</span>
                  {isSelected && <Check size={18} color={appBarColor} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MultiSelectDropdown;