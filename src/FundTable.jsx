import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';

const FundTable = ({ 
  appBarColor, 
  fund, 
  emailDates, 
  isChecked, 
  onCheckboxChange, 
  isExpanded, 
  onToggleExpand 
}) => {
  const { t } = useTranslation();

  const normalizeDate = (dateString) => {
    if (!dateString) return t('na');
    return dateString.replace(/-/g, '/');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4 transition-all">
      {/* Card Header - Using Inline Styles to Force Colors */}
      <div 
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }} 
        className="p-4 sm:px-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => onCheckboxChange(fund.name, !isChecked)}
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
            className="flex items-center group"
          >
            <div 
              style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: isChecked ? 'none' : '2px solid #cbd5e1',
                backgroundColor: isChecked ? appBarColor : '#ffffff' 
              }}
            >
              {isChecked && (
                <CheckCircle2 
                  size={16} 
                  style={{ color: appBarColor === '#FFCD00' ? '#0f172a' : '#ffffff' }} 
                />
              )}
            </div>
            
            {/* FORCE TEXT COLOR HERE */}
            <span 
              style={{ 
                marginLeft: '12px', 
                fontWeight: '700', 
                fontSize: '1.125rem', 
                color: '#1e293b', // Explicit slate-800
                backgroundColor: 'transparent' 
              }}
            >
              {fund.name}
            </span>
          </button>
          
          <span 
            style={{ 
              fontSize: '10px', 
              fontWeight: '900', 
              padding: '2px 8px', 
              borderRadius: '9999px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              backgroundColor: isChecked ? '#dcfce7' : '#f1f5f9',
              color: isChecked ? '#15803d' : '#64748b'
            }}
          >
            {isChecked ? t('sendMail') : 'Muted'}
          </span>
        </div>

        <button
          onClick={onToggleExpand}
          style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: '#94a3b8' }}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{t('issueDate')}</th>
                <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{t('emailDate')}</th>
                <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{t('dayLeft')}</th>
                <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>{t('isSent')}</th>
              </tr>
            </thead>
            <tbody>
              {fund.issues.map((issue, index) => {
                const emailDate = emailDates && index < emailDates.length ? emailDates[index] : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let diffDays = null;
                if (emailDate && emailDate.date !== 'Invalid date') {
                  const emailDateObj = new Date(emailDate.date.replace(/-/g, '/'));
                  emailDateObj.setHours(0, 0, 0, 0);
                  diffDays = Math.ceil((emailDateObj - today) / (1000 * 60 * 60 * 24));
                }

                const isPast = diffDays !== null && diffDays < 0;

                return (
                  <tr
                    key={issue.issue_date}
                    style={{ 
                      backgroundColor: isPast ? '#0f172a' : '#ffffff', 
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: isPast ? '#ffffff' : '#334155' }}>
                      {normalizeDate(issue.issue_date)}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: isPast ? '#cbd5e1' : '#475569' }}>
                      {emailDate ? normalizeDate(emailDate.date) : t('noEmailDateSet')}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '700',
                        backgroundColor: isPast ? 'rgba(255,255,255,0.1)' : '#eff6ff',
                        color: isPast ? '#ffffff' : '#2563eb'
                      }}>
                        {diffDays !== null ? `${diffDays}d` : t('na')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {emailDate?.isSent ? (
                          <CheckCircle2 size={18} color="#22c55e" />
                        ) : (
                          <Circle size={18} color={isPast ? 'rgba(255,255,255,0.2)' : '#cbd5e1'} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FundTable;