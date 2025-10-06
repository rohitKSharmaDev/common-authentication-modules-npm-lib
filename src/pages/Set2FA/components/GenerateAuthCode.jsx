import React, { useState } from "react";
import { Stack, Typography, Box, IconButton, Button, Link } from "@mui/material";
import { useIntl, FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";

import MainCard from "../../../components/common/MainCard.jsx";
import CircularLoader from "../../../components/common/CircularLoader.jsx";
import { useAuth, useAuthContext } from "../../../providers/AuthProvider.jsx";

const GenerateAuthCode = ({ authToken: initialAuthToken }) => {
  const { onAuthSuccess } = useAuth();
  const { config } = useAuthContext();

  const [authToken, setAuthToken] = useState(initialAuthToken);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [sendRequest, setSendRequest] = useState(false);
  const intl = useIntl();
  const getMessage = (id) => intl.formatMessage({ id });
  const navigate = useNavigate();

  const mapRecoveryCodes = (response)=> {
    setRecoveryCodes(prevCodes => {
      const newCodes = [...prevCodes];
      response.forEach((code, index) => {
        newCodes[index] = code;
      });
      return newCodes;
    });
  }

  const showSnackBar = (msg, isSuccess)=> {
    return config.notify(getMessage(msg), isSuccess);
  };

  const handleExit = (shouldDownload = false) => {
    if(shouldDownload) {
      handleDownload(recoveryCodes);
    }

    onAuthSuccess({ token: authToken }); 
    navigate("/on-board", { state: 'newUser' });
  }

  const generateRecoveryCodes = () => {
    setSendRequest(true);

    config.services.generateRecoveryCodes({}, authToken).then((response)=> {
      if(response.data?.recoveryCodes) {
        mapRecoveryCodes(response.data?.recoveryCodes);

      } else {
        showSnackBar("Recovery codes has already been generated");
        
      }
    }).catch((e)=> {
      showSnackBar("Something went wrong, Please contact support");
    }).finally(()=> {
      setSendRequest(false);
    })
  };

  const handleDownload = (codes = recoveryCodes) => {
    if(!codes || codes.length === 0) {
      return;
    }

    const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery_codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const codesText = recoveryCodes.join('\n');
    navigator.clipboard.writeText(codesText)
      .then(() => {
        showSnackBar("Recovery codes copied to clipboard!", true);
      })
      .catch(err => {
        showSnackBar("Something went wrong",);
      });
  };

  return (
    <Stack>
      <Typography variant="h4" alignSelf={"flex-start"} mb={2}>
        <FormattedMessage id="Unable to use authenticator app?" />
      </Typography>
      <MainCard
        sx={{
          boxShadow:
            "0 2px 1px -1px #0003,0 1px 1px #00000024,0 1px 3px #0000001f",
          borderRadius: "4px",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          width: "27rem"
        }}
      >   
        <Typography variant="h6" marginTop={"1.5rem" }  sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
          <FormattedMessage id="use-one-time-codes-authenticator-app" />
        </Typography>
        <Typography variant="h6" marginTop={"1.5rem" }  sx={{ textAlign: 'center', fontSize: '0.85rem' }}>
         {intl.formatMessage({id: "messageRecoveryCodes"})}
        </Typography>

        {recoveryCodes.length > 0 && (
        <Box sx={{ marginTop: '2rem' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            <FormattedMessage id="recovery-codes" />
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            {/* Codes Container */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRight: 'none',
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr',
                height: '9rem'
                
              }}
            >
              {recoveryCodes.slice(0, 5).map((code, index) => (
                <Box key={index}>
                  {code || ""}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                flex: 1,
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderLeft: 'none',
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr',
                height: '9rem'
              }}
            >
              { recoveryCodes.slice(5, 10).map((code, index) => (
                <Box key={index}>
                  {code || ""}
                </Box>
              ))}
            </Box>
          </Box>

        {/* Action Buttons and Save & Exit Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
          }}
        >
          {/* Action Icons */}
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            {/* <IconButton aria-label="download" sx={{ border: '1px solid lightgray' }} onClick={() => handleDownload(recoveryCodes.length ? recoveryCodes : null)}>
              <DownloadIcon />
            </IconButton> */}
            <IconButton aria-label="copy code" sx={{border: '1px solid lightgray'}} onClick={handleCopy} >
              {config?.assets?.ContentCopyIcon}
            </IconButton>
          </Box>

          {/* Save & Exit Button */}
          <Button variant="contained" color="primary" onClick={() => handleExit(true)}>
            <FormattedMessage id="download-and-exit" />
          </Button>
        </Box>
        </Box>
        )}

        {recoveryCodes.length == 0 && (
        <>
        <Stack direction="row" justifyContent="center" sx={{ width: '100%' }} spacing={1} mt={12}>
              <Button disabled={sendRequest} variant="contained" type="submit" sx={{ width: '100%' }} onClick={generateRecoveryCodes} startIcon={sendRequest && <CircularLoader />}>
            <FormattedMessage id="generate-recovery-code" />
          </Button>
        </Stack>

        <Typography sx={{ textAlign: 'center', marginTop: '0.8rem' }}>
          <Link href="javascript:void(0)" color="primary" onClick={handleExit}>
            <FormattedMessage id="take-me-to-dashboard" />
          </Link>
        </Typography>
        </>
        )}
          
      </MainCard>
    </Stack>    
  );
};
export default GenerateAuthCode;
