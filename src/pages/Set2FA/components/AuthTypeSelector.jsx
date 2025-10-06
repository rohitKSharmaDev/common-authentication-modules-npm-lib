import React, { useState } from "react";
import { Stack, Typography, Card, Button, Box } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useTheme } from '@mui/material/styles';
import { KeyboardArrowLeft } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import CircularLoader from "../../../components/common/CircularLoader.jsx";

import { useAuthContext } from "../../../providers/AuthProvider.jsx";

const AuthTypeSelector = ({ authTypeSelectorCallback, sendCodeRequest }) => {
  const { config } = useAuthContext();
  const CheckIcon = config?.assets?.CheckIcon ?? null;
  
  const [selectedAuthType, setSelectedAuthType] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleCardClick = (type) => setSelectedAuthType(type);

  const setAuthType = (type)=> {
    authTypeSelectorCallback(type)
  };

  return (
    <Stack sx={{ width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center', padding:"1rem"}}>
      <Stack minHeight="300px" justifyContent="flex-start" sx={{mb: '1.875rem'}}>
        <Button
          onClick={() => navigate('/login')}
          variant="text"
          color="inherit"
          startIcon={<KeyboardArrowLeft />}
          sx={{
            marginBottom: '0.5rem',
            alignSelf: 'flex-start',
            pl: 0
          }}
          >
          <FormattedMessage id="back-to-login" />
        </Button>
        <Typography variant="h4" alignSelf={"flex-start"} mb={2}>
          {selectedAuthType == 1 ? (<FormattedMessage id="enable-2fa-via-qr" />) : (<FormattedMessage id="enable-2fa-via-email" />)}
        </Typography>
        
        <Stack direction={{ xs :"column", sm : "row"}} spacing={2} alignItems="center">
          {
            config?.activeBrandConfig?.twoFactorAuth?.methods?.email?.isEnabled && (
              <Card
                sx={{
                  boxShadow: "0 2px 1px -1px #0003,0 1px 1px #00000024,0 1px 3px #0000001f",
                  borderRadius: '3px',
                  overflow: 'hidden',
                  padding: '20px 30px',
                  width: { xs : "100%", sm : '22rem'},
                  border: selectedAuthType == 2 ? `2px solid ${theme.palette.primary.main}` : '2px solid #e0e0e0',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  },
                }}

                selected={selectedAuthType == 2}
                onClick={()=> {
                  handleCardClick(2)
                }} 
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Typography variant="h4">
                    <FormattedMessage id="OTP via Email"/>
                  </Typography>
                  {CheckIcon && React.cloneElement(CheckIcon, {
                    color: 'primary',
                    sx: {
                      marginRight: 1,
                      visibility: selectedAuthType === 2 ? 'visible' : 'hidden'
                    }
                  })}
                </Stack>
                <Typography variant="h6" style={{ fontSize: '0.75rem', marginTop: '15px' }}>
                    <FormattedMessage id="Check-your-email-inbox"/>
                </Typography>
              </Card>
            )
          }
          {
            config?.activeBrandConfig?.twoFactorAuth?.methods?.googleAuthQR?.isEnabled && (
              <Card
                sx={{
                  boxShadow: "0 2px 1px -1px #0003,0 1px 1px #00000024,0 1px 3px #0000001f",
                  borderRadius: '3px',
                  overflow: 'hidden',
                  padding: '20px 30px',
                  width: { xs : "100%", sm : '22rem'},
                  border: selectedAuthType == 1 ? `2px solid ${theme.palette.primary.main}` : 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  },
                }}

                selected={selectedAuthType == 1}
                onClick={()=> {
                  handleCardClick(1)
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Typography variant="h4">
                    <FormattedMessage id="QR Code"/>
                  </Typography>
                  {CheckIcon && React.cloneElement(CheckIcon, {
                    color: 'primary',
                    sx: {
                      marginRight: 1,
                      visibility: selectedAuthType === 1 ? 'visible' : 'hidden'
                    }
                  })}
                </Stack>
                <Typography variant="h6" style={{ fontSize: '0.75rem', marginTop: '15px' }}>
                    <FormattedMessage id="Download-and-install-a-QR-code"/>
                </Typography>
              </Card>
            )
          }
        </Stack>
        
        {selectedAuthType && (
          <Box direction="row" justifyContent="flex-start" spacing={1} mt={2}>
            {selectedAuthType ? (
              <Button
                disabled={sendCodeRequest}
                variant="contained"
                type="submit"
                onClick={() => {
                  setAuthType(selectedAuthType);
                }}
                startIcon={sendCodeRequest && <CircularLoader />}
              >
                &gt;&nbsp;
                <FormattedMessage id="continue" />
              </Button>
            ) : null}
          </Box>

          )
        }
      </Stack>

    </Stack>
  );
};

export default AuthTypeSelector;
