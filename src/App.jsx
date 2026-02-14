import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Loader2, 
  Settings, 
  Globe, 
  ListFilter // Icon for the new header
} from 'lucide-react';

import LanguageSwitch from './LanguageSwitch';
import MultiSelectDropdown from './MultiSelectDropdown';
import EmailSetting from './EmailSetting';
import FundTable from './FundTable';

const companyToColor = {
  "Manulife": '#009739',
  "AIA": '#E4002B',
  "Sunlife": '#FFCD00',
  "AXA": '#00008F',
  "Chubb": '#004A9F',
  "Prudential": '#ed1b2e',
  "FWD": '#e67e22',
};

const App = () => {
  const IsProduction = true;
  const IsWp = true;
  const { t } = useTranslation();

  // --- Domain & Initial Branding Logic ---
  const domain = window.root4appSettings?.domain || false;
  const savedCompany = localStorage.getItem('company');
  const savedColor = localStorage.getItem('appBarColor');

  let initialCompany, initialColor;
  if (domain) {
    const lowerCaseDomain = domain.toLowerCase();
    const domainMap = {
      "portal": "Manulife", "manu": "Manulife", "pru": "Prudential",
      "sunlife": "Sunlife", "aia": "AIA", "axa": "AXA", "chubb": "Chubb", "fwd": "FWD"
    };
    const key = Object.keys(domainMap).find(k => lowerCaseDomain.includes(k));
    initialCompany = domainMap[key] || savedCompany || "Manulife";
    initialColor = companyToColor[initialCompany];
  } else {
    initialCompany = savedCompany || "Manulife";
    initialColor = savedColor || companyToColor[initialCompany];
  }

  // --- State Hooks ---
  const [company, setCompany] = useState(initialCompany);
  const [appBarColor, setAppBarColor] = useState(initialColor);
  const [wpUserEmail, setWpUserEmail] = useState('');
  const [email, setEmail] = useState('');
  const [numberOfDayAhead, setNumberOfDayAhead] = useState(5);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [outputData1, setOutputData1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [selectedFundsForMail, setSelectedFundsForMail] = useState([]);
  const [userData, setUserData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedFunds, setExpandedFunds] = useState({});

  const [savedWpUserEmail, setSavedWpUserEmail] = useState('');
  const [savedNumberOfDayAhead, setSavedNumberOfDayAhead] = useState(null);
  const [savedReminderTime, setSavedReminderTime] = useState('');
  const [savedSelectedFunds, setSavedSelectedFunds] = useState([]);
  const [savedSelectedFundsForMail, setSavedSelectedFundsForMail] = useState([]);

  // --- Logic Handlers ---
  const handleCheckboxChange = (fundName, checked) => {
    setSelectedFundsForMail((prev) =>
      checked ? (prev.includes(fundName) ? prev : [...prev, fundName]) : prev.filter((name) => name !== fundName)
    );
  };

  const handleSave = async () => {
    try {
      const serverURL = IsProduction ? (import.meta.env.VITE_SERVER_URL || 'http://localhost:7003') : 'http://localhost:7003';
      await axios.post(`${serverURL}/saveUserData`, {
        wpUserEmail,
        numberOfDayAhead,
        reminderTime,
        selectedFunds,
        selectedFundsForMail,
      });
      await fetchUserData();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleTestEmail = async () => {
    try {
      const serverURL = IsProduction ? (import.meta.env.VITE_SERVER_URL || 'http://localhost:7003') : 'http://localhost:7003';
      const response = await axios.post(`${serverURL}/sendTestEmail`, { wpUserEmail });
      if (response.status === 200) alert('Test email sent successfully');
    } catch (error) {
      alert('Error sending test email');
    }
  };

  const fetchUserData = async () => {
    if (!wpUserEmail) return;
    try {
      const serverURL = IsProduction ? (import.meta.env.VITE_SERVER_URL || 'http://localhost:7003') : 'http://localhost:7003';
      const response = await axios.post(`${serverURL}/getUserData`, { wpUserEmail });
      const data = response.data;
      setUserData(data);
      
      const fundNames = data.funds.map(f => f.name);
      setSelectedFunds(fundNames);
      const mailFunds = data.funds.filter(f => f.email_date.some(ed => ed.isEnabled)).map(f => f.name);
      setSelectedFundsForMail(mailFunds);
      setNumberOfDayAhead(data.numberOfDayAhead);
      setReminderTime(data.reminderTime || '09:00');

      setSavedWpUserEmail(wpUserEmail);
      setSavedNumberOfDayAhead(data.numberOfDayAhead);
      setSavedReminderTime(data.reminderTime || '09:00');
      setSavedSelectedFunds(fundNames);
      setSavedSelectedFundsForMail(mailFunds);
      setHasUnsavedChanges(false);
    } catch (err) { console.error(err); }
  };

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
    localStorage.setItem('company', company);
  }, [appBarColor, company]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (selectedFunds.length === 0) { setOutputData1([]); return; }
      try {
        setLoading(true);
        const serverURL = IsProduction ? (import.meta.env.VITE_SERVER_URL || 'http://localhost:7003') : 'http://localhost:7003';
        const res = await axios.post(`${serverURL}/getData`, { selectedFunds });
        setOutputData1(res.data);
      } catch (err) { setError('Failed to fetch data'); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedFunds]);

  useEffect(() => {
    if (IsWp && window.root4appSettings) {
      const fetchWpEmail = async () => {
        const apiUrl = window.root4appSettings.root + 'myplugin/v1/system-login-name';
        const res = await axios.get(apiUrl, {
          headers: { 'X-WP-Nonce': window.root4appSettings.nonce },
          withCredentials: true,
        });
        if (res.data.user_email) {
          setWpUserEmail(res.data.user_email);
          setEmail(res.data.user_email);
        }
      };
      fetchWpEmail();
    } else {
      setWpUserEmail('thompsonkylaw@gmail.com');
      setEmail('thompsonkylaw@gmail.com');
    }
  }, []);

  useEffect(() => { if (wpUserEmail) fetchUserData(); }, [wpUserEmail]);

  useEffect(() => {
    const isChanged =
      wpUserEmail !== savedWpUserEmail ||
      numberOfDayAhead !== savedNumberOfDayAhead ||
      reminderTime !== savedReminderTime ||
      JSON.stringify(selectedFunds) !== JSON.stringify(savedSelectedFunds) ||
      JSON.stringify(selectedFundsForMail) !== JSON.stringify(savedSelectedFundsForMail);
    setHasUnsavedChanges(isChanged);
  }, [wpUserEmail, numberOfDayAhead, reminderTime, selectedFunds, selectedFundsForMail]);

  const handleBackNavigation = () => {
    const hostname = window.location.hostname;
    const paths = ['portal', 'pru', 'sunlife', 'aia', 'axa', 'chubb', 'fwd', 'tool'];
    const match = paths.find(p => hostname.includes(p));
    window.location.href = match ? `https://${match}.aimarketings.io/tool-list` : "#";
  };

  // --- Inline Styles ---
  const styles = {
    wrapper: { minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', paddingBottom: '40px' },
    header: { backgroundColor: appBarColor, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 16px' },
    grid: { display: 'flex', flexWrap: 'wrap', gap: '32px', marginTop: '32px' },
    card: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={{ ...styles.container, height: '64px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleBackNavigation} style={{ background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: company === 'Sunlife' ? '#003946' : 'white' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: company === 'Sunlife' ? '#003946' : 'white' }}>
            {t('Medical Financial Calculator')}
          </h1>
        </div>
      </header>

      <main style={styles.container}>
        <div style={styles.grid}>
          {/* Main Content */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* NEW: Removed Card Container & Added Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ListFilter size={20} color="#475569" />
                </div>
                <label style={{ fontSize: '16px', fontWeight: 700, color: '#334155' }}>
                  {t('Select Funds')}
                </label>
              </div>
              
              <MultiSelectDropdown selectedItems={selectedFunds} onChange={(e) => setSelectedFunds(e.target.value)} />
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} color={appBarColor} />
              </div>
            ) : outputData1.length > 0 ? (
              outputData1.map(fund => (
                <FundTable
                  key={fund.name}
                  appBarColor={appBarColor}
                  fund={fund}
                  emailDates={userData?.funds.find(f => f.name === fund.name)?.email_date || []}
                  isChecked={selectedFundsForMail.includes(fund.name)}
                  onCheckboxChange={handleCheckboxChange}
                  isExpanded={expandedFunds[fund.name]}
                  onToggleExpand={() => setExpandedFunds(p => ({ ...p, [fund.name]: !p[fund.name] }))}
                />
              ))
            ) : <div style={{ textAlign: 'center', padding: '60px', background: '#f1f5f9', borderRadius: '16px', border: '2px dashed #cbd5e1', color: '#64748b' }}>{t('pleaseSelectFund')}</div>}
          </div>

          {/* Sidebar */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ position: 'sticky', top: '96px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                <div style={{ background: '#f8fafc', padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={16} color="#475569" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Configuration</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <EmailSetting 
                    email={email} setEmail={setEmail} 
                    numberOfDayAhead={numberOfDayAhead} setNumberOfDayAhead={setNumberOfDayAhead}
                    reminderTime={reminderTime} setReminderTime={setReminderTime}
                    hasUnsavedChanges={hasUnsavedChanges} onSave={handleSave} onTestEmail={handleTestEmail}
                    appBarColor={appBarColor} 
                  />
                </div>
              </div>
              <div style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}><Globe size={18} /><span style={{ fontSize: '14px', fontWeight: 500 }}>Preferences</span></div>
                <LanguageSwitch setAppBarColor={setAppBarColor} setCompany={setCompany} appBarColor={appBarColor} />
              </div>
            </div>
          </div>
        </div>
       </main>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default App;