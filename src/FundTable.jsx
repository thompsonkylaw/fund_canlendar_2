import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FundTable = ({ appBarColor, fund, emailDates, isChecked, onCheckboxChange, isExpanded, onToggleExpand }) => {
  const { t } = useTranslation();

  const normalizeDate = (dateString) => {
    if (!dateString) return t('na');
    return dateString.replace(/-/g, '/');
  };

  const title = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6">{fund.name}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={(e) => onCheckboxChange(fund.name, e.target.checked)}
            name="sendMail"
            sx={{
              color: appBarColor,
              '&.Mui-checked': {
                color: appBarColor,
              },
            }}
          />
        }
        label={t('sendMail')}
      />
    </Box>
  );

  return (
  <Card sx={{ mb: 4 }}>
    <CardHeader
      title={title}
      action={
        <IconButton
          onClick={onToggleExpand}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          disableRipple
          sx={{
            '&:hover, &:active': {
              backgroundColor: 'transparent',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      }
    />
    <Collapse in={isExpanded}>
      <CardContent>
        <TableContainer component={Paper}>
          <Table
            sx={{
              '& .MuiTableCell-root': {
                fontSize: '1.2rem',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t('issueDate')}</TableCell>
                <TableCell>{t('emailDate')}</TableCell>
                <TableCell>{t('dayLeft')}</TableCell>
                <TableCell>{t('isSent')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fund.issues.map((issue, index) => {
                const emailDate = emailDates && index < emailDates.length ? emailDates[index] : null;
                const isRowEnabled = emailDate ? emailDate.isEnabled : false;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // This calculation is no longer used for styling
                const issueDateObj = new Date(issue.issue_date.replace(/\//g, '-'));
                issueDateObj.setHours(0, 0, 0, 0);
                const issueDateDiffDays = Math.ceil((issueDateObj - today) / (1000 * 60 * 60 * 24));

                let diffDays = null;
                if (emailDate && emailDate.date !== 'Invalid date') {
                  const emailDateObj = new Date(emailDate.date.replace(/-/g, '/'));
                  emailDateObj.setHours(0, 0, 0, 0);
                  diffDays = Math.ceil((emailDateObj - today) / (1000 * 60 * 60 * 24));
                }
                
                return (
                  <TableRow
                    key={issue.issue_date}
                    sx={{
                      
                      // ✅ Changed to use 'diffDays' for background color
                      backgroundColor: diffDays !== null && diffDays < 0 ? '#616161' : 'white',
                      // ✅ Changed to use 'diffDays' for opacity
                      opacity: diffDays !== null && diffDays < 0 ? 1 : (isRowEnabled ? 1 : 0.5),
                      '& .MuiTableCell-root': {
                        fontWeight: emailDate && diffDays === 0 ? 'bold' : 'normal',
                        // ✅ Changed to use 'diffDays' and set a contrasting text color (white)
                        color: diffDays !== null && diffDays < 0 ? 'black' : 'inherit',
                      },
                    }}
                  >
                    <TableCell>{normalizeDate(issue.issue_date)}</TableCell>
                    <TableCell>{emailDate ? normalizeDate(emailDate.date) : t('noEmailDateSet')}</TableCell>
                    <TableCell>{diffDays !== null ? diffDays : t('na')}</TableCell>
                    <TableCell>{emailDate ? (emailDate.isSent ? t('yes') : t('no')) : t('na')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Collapse>
  </Card>
);
};

export default FundTable;