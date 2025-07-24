import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const Setting = ({ setAppBarColor, onClose, onTestEmail }) => {
  const { t } = useTranslation();
  const colors = ['#009739', '#E4002B', '#FFCD00', '#00008F', '#004A9F', '#ed1b2e'];

  const handleColorSelect = (color) => {
    setAppBarColor(color);
    onClose();
  };

const IsProduction = window.root4appSettings?.IsProduction || false;  
// const [isWhitelisted, setIsWhitelisted] = useState(false);
 const whitelist = [import.meta.env.VITE_ADMIN_1_EMAIL, import.meta.env.VITE_ADMIN_2_EMAIL];
 const whitelisted = whitelist.includes(window.root4appSettings?.user_email);
//  setIsWhitelisted(whitelisted); // Set state first

 console.log("IsProduction=", window.root4appSettings?.IsProduction);
 console.log("logged in user email=", window.root4appSettings?.user_email);
 console.log("whitelisted=", whitelisted);
 const domain = window.root4appSettings?.domain || false;
  
  console.log("domain=", domain);

  return (
    <>
      <DialogTitle>{t('settings')}</DialogTitle>
      <DialogContent>
        <Box>
       {(whitelisted || !IsProduction) &&colors.map((color) => (
            <Button
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                color: color === '#FFCD00' ? 'black' : 'white',
                margin: '5px',
                minWidth: '80px',
              }}
            >
              {color}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" color="secondary" onClick={onTestEmail}>
            {t('testEmailButton')}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </>
  );
};

export default Setting;