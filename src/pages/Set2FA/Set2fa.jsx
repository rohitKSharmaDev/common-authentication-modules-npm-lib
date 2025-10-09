import React, { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  Button,
  Link,
  FormHelperText,
} from "@mui/material";
import MainCard from "../../components/common/MainCard.jsx";
import { useIntl, FormattedMessage } from "react-intl";

import OTPInput from "./components/OTPInput.jsx";
import AuthTypeSelector from "./components/AuthTypeSelector.jsx";
import GenerateAuthCode from "./components/GenerateAuthCode.jsx";
import { useLocation, useNavigate } from 'react-router-dom';
import OTPTimer from "./components/OTPTimer.jsx";

import { useAuth, useAuthContext, useAuthAdapter } from "../../providers/AuthProvider.jsx";
import CircularLoader from "../../components/common/CircularLoader.jsx";

const Set2FA = () => {
  const adapter = useAuthAdapter();
  const { onAuthSuccess } = useAuth();
  const { config } = useAuthContext();

  const location = useLocation();
  const intl = useIntl();
  const getMessage = (id) => intl.formatMessage({ id });

  const [authToken, setAuthToken] = useState(location.state?.authToken || null);
  const [userHash, setUserHash] = useState(location.state?.userHash || null);
  const navigate = useNavigate();

  const [authType, setAuthType] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [is2FACompleted, setIs2FACompleted] = useState(false);

  const [QRData, setQRData] = useState({
    qrImage: null,
    secret: null
  });

  const [OTPSentTo, setOTPSentTo] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState({
    status: false,
    reset: false,
    message: ""
  });
  
  const [startTimerFlag, setStartTimerFlag] = useState(false);

  const showSnackBar = (msg, isSuccess)=> {
    return adapter.notify(getMessage(msg), isSuccess);
  };

  const generateSecret = (authType)=> {
    setIsProcessing(true);
    config.services.generateSecret({
      "userHash": userHash,
      "authType": authType
    }).then((response)=> {
      const {secret, qrImage, userHash} = response;
      if(secret && qrImage) {
        setAuthType(authType);

        setQRData({
          qrImage: qrImage,
          secret: secret
        })

      } else {
        getMessage("sm-went-wrong-contact-support");
      }
    }).catch((e)=> {
      showSnackBar("sm-went-wrong-contact-support");
    }).finally(()=> {
      setIsProcessing(false);
    })
  };

  const generateEmailOTP = (authType)=> {
    resetOtpError(true);
    setIsProcessing(true);
    config.services.generateEmailOTP({
      "userHash": userHash,
      "authType": authType
    }).then((response)=> {
      if(response.data?.sentTo) {
        setOTPSentTo(response.data.sentTo);
      }

      setAuthType(authType);
      startTimer();
    }).catch((e)=> {
      showSnackBar("sm-went-wrong-contact-support");
    }).finally(()=> {
      setIsProcessing(false);
    })
  };
  
  const authTypeSelectorCallback = (authType)=> {
    if(authType == 1) {
      generateSecret(authType);
    } else if(authType == 2) {
      generateEmailOTP(authType);
    }
  }

  const otpInputSuccess = (otpData)=> {
    resetOtpError();
    if(otpData.value) {
      setOtpValue(otpData.value);  
    }
  }

  const resetOtpError = (reset) => {
    setOtpError({
      status: false,
      reset: (reset)? true: false,
      message: ""
    });
  };
  
  const showOTPError = (msg)=> {
    setOtpError({
      status: true,
      message: msg
    });
  };

  const verifyOTP = ()=> {
    setIsProcessing(true);
    config.services.verifyOTP({
      "userHash": userHash,
      "authType": authType,
      "otp": otpValue,
      "set2FA": 1 //optional
    }).then((res)=> {
      if(res.token) {
        showSnackBar("2FA-success", true);
        setIs2FACompleted(true);

        if(authType == 1) {
          setAuthToken(res.token);
          
        } else {
          onAuthSuccess({ token: res.token });
          navigate("/on-board", { state: 'newUser' });
        }
        
      } else {
        showSnackBar("sm-went-wrong-contact-support");
      }


    }).catch((e)=> {
      showOTPError(getMessage("invalid-code"));
      console.log(e);
    }).finally(()=> {
      setIsProcessing(false);
    })
  }

  const startTimer = ()=> {
    setStartTimerFlag(true); // Restart the timer
  };

  const timerCompleteCallback = ()=> {
    setStartTimerFlag(false);
  };

  useEffect(() => {
    if (!userHash) {
      navigate('/dashboard');
    } else if (authType === 1) {
      
    } else if (authType === 2) {
      // Handle authType 2
    }
  }, [userHash, authType, navigate]);


  return (
    <Stack height={'100%'}>
      {!authType ? (
        <AuthTypeSelector sendCodeRequest={isProcessing} authTypeSelectorCallback={authTypeSelectorCallback}></AuthTypeSelector>
      ) : <></>}

      {authType ? (
        <Stack
          sx={{
            margin: "6rem auto 0rem auto", padding:"1rem"
          }}
        >
          {!is2FACompleted ? <Button
            onClick={() => {
              setAuthType(null);
              resetOtpError();
            }}
            variant="outlined"
            startIcon={config?.assets?.ArrowBackIcon}
            sx={{
              marginBottom: '1rem',
              alignSelf: 'flex-start',
              color: 'black',
              border: '1px solid lightgrey',
              '&:hover': {
                color: 'grey',
                border: '1px solid grey',
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <FormattedMessage id="go-back" />
          </Button> : <></>}
          
          
          {authType == 2 ? (
            <Stack>
            <Typography variant="h4" alignSelf={"flex-start"} mb={2}>
              <FormattedMessage id="enable-2fa-via-email" />
            </Typography>
            <MainCard
              sx={{
                boxShadow:
                  "0 2px 1px -1px #0003,0 1px 1px #00000024,0 1px 3px #0000001f",
                borderRadius: "4px",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                width: { xs : "100%", sm : "27rem"}
              }}
            >
              <Typography 
                  variant="body1" 
                  padding="10px 30px" 
                  color="success.main"
                  sx={{ textAlign: 'center' }}
              >
                <FormattedMessage id="6-digit-otp-sent" /> <br />
                  {OTPSentTo} <br />
                <FormattedMessage id="enter-submit-otp" /> <br />
              </Typography>
              <Typography variant="h5" marginTop={"4.5rem" } marginBottom={'1rem'}  sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
                <FormattedMessage id="enter-6digit-otp-email" />
              </Typography>

              <OTPInput onSuccess={otpInputSuccess} error={otpError} />
              {otpError.status && <FormHelperText sx={{ marginInlineStart: '25px'}} error>{otpError.message}</FormHelperText>}
              
              <Stack direction="row" justifyContent="center" sx={{ width: '100%' }} spacing={1} mt={2}>
                <Button disabled={otpValue.length < 6 || otpError.status || isProcessing} variant="contained" type="submit" sx={{ width: '100%' }} onClick={verifyOTP} startIcon={isProcessing && <CircularLoader /> }>
                  <FormattedMessage id="submit" />
                </Button>
              </Stack>
            
              <Typography sx={{ textAlign: 'center', marginTop: '0.8rem' }}>
                <Stack direction="row" justifyContent="center" spacing={1}>
                  <FormattedMessage id="didnot-rcv-otp" />{' '}
                  <Stack sx={{ marginLeft: '0.4rem'}}>
                    {startTimerFlag ? (
                      <OTPTimer startTimer={startTimerFlag} timerCompleteCallback={timerCompleteCallback} />
                    ): (
                      <Link href="#" color="primary" onClick={(e) => {
                          e.preventDefault();
                          generateEmailOTP(2);
                        }}
                      >
                        Resend
                      </Link>
                    )}
                  </Stack>
                </Stack>
              </Typography>

            </MainCard>
            </Stack>
            ) : <></>
          }

          {authType == 1 ? (
            <Stack>
              {!is2FACompleted && (
              <Stack>
              <Typography variant="h4" alignSelf={"flex-start"} mb={2}>
                <FormattedMessage id="enable-2fa-via-qr" />
              </Typography>
              <MainCard
                sx={{
                  boxShadow:
                    "0 2px 1px -1px #0003,0 1px 1px #00000024,0 1px 3px #0000001f",
                  borderRadius: "4px",
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xs : "100%", sm : "29rem"}
                }}
              >   
                <Typography variant="h5" sx={{ textAlign: 'left', fontSize: '0.78rem' }}>
                  <Typography component="span" sx={{ fontWeight: '700', fontSize: 'inherit' }}>
                    <FormattedMessage id="step-1" />
                  </Typography>
                  {' '}
                  <FormattedMessage id="enable-2fa-auth-step1-msg" values={{
                    "2faHelpLink": config?.activeBrandConfig.twoFactorAuth.helpLink ? <Link href={config?.activeBrandConfig.twoFactorAuth.helpLink} target='_blank' sx={{ textDecoration: 'none', color: 'blue' }}><FormattedMessage id="authenticator-app"/></Link> : <FormattedMessage id="authenticator-app"/>
                  }}/>
                  
                </Typography>

                <Stack direction="row" marginTop="1.5rem" marginBottom="2rem" alignItems="center" justifyContent="center" sx={{ flexWrap: 'wrap'}}>
                  <img
                    src={QRData.qrImage} // Replace with your QR code image URL
                    alt="QR Code"
                    style={{
                      border: '1px solid lightgrey',
                      maxWidth: '32%', // Adjust width as necessary
                      height: 'auto',
                    }}
                  />

                  <Typography variant="h6" sx={{ flexGrow: 0.5, textAlign: 'center', fontWeight: 'bold' }}>
                    <FormattedMessage id="OR"/>
                  </Typography>

                  <Stack sx={{ textAlign: 'left', maxWidth: '50%'}}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{intl.formatMessage({id: "Secret Key"})}</Typography>
                    <Typography sx={{ color: 'grey.600', fontSize:'0.7rem', fontWeight: 'bold', overflowWrap: 'break-word' }}>
                      {QRData.secret}
                    </Typography>
                  </Stack>
                </Stack>

                <Typography variant="h5" sx={{ textAlign: 'left', fontSize: '0.78rem', marginBottom:'0.5rem' }}>
                  <Typography component="span" sx={{ fontWeight: '700', fontSize: 'inherit' }}>
                    <FormattedMessage id="step-2" />
                  </Typography>
                  {' '}
                  <FormattedMessage id="enter-6digit-otp-qr" />
                </Typography>

                <OTPInput usedInSet2FA={true} onSuccess={otpInputSuccess} error={otpError} />
                {otpError.status && <FormHelperText sx={{ marginInlineStart: '5px' }} error>{otpError.message}</FormHelperText>}
                
                <Stack direction="row" justifyContent="center" sx={{ width: '100%' }} spacing={1} mt={1.5}>
                  <Button disabled={otpValue.length < 6 || otpError.status || isProcessing} variant="contained" type="submit" sx={{ width: '100%' }} onClick={verifyOTP} startIcon={isProcessing && <CircularLoader /> }>
                      <FormattedMessage id="submit" />
                  </Button>
                </Stack>

              </MainCard>
              </Stack>
            )}
            {is2FACompleted && (
              <GenerateAuthCode authToken = {authToken}></GenerateAuthCode>
            )}
            </Stack>
            ) : <></>
          }

        </Stack>
        ) : <></>
      }

    </Stack>
  );
};

export default Set2FA;