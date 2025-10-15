import { Typography, Button, Stack, Link } from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import OTPInput from "../Set2FA/components/OTPInput.jsx";
import OTPTimer from "../Set2FA/components/OTPTimer.jsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useAuth, useAuthContext } from "../../providers/AuthProvider.jsx";

export default function TwoFactorAuth({ userAuthData, startTimerNow }) {
  const intl = useIntl();
  const getMessage = (id) => intl.formatMessage({ id });

  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState({ status: false, reset: false, message: "" });
  const [startTimerFlag, setStartTimerFlag] = useState(startTimerNow ?? false);
  const [sendCodeRequest, setSendCodeRequest] = useState(false);

  const { onAuthSuccess } = useAuth();        // 👈 from adapter
  const { config, notify } = useAuthContext(); // 👈 config.services + notify

  const showSnackBar = (msg, isSuccess = false) => {
    notify(getMessage(msg), isSuccess ? "success" : "error");
  };

  const timerCompleteCallback = () => {
    setStartTimerFlag(false);
  };

  const showOTPError = (msg) => {
    setOtpError({ status: true, message: msg });
  };

  const resetOtpError = (reset) => {
    setOtpError({ status: false, message: "", reset: reset ? true : false });
  };

  const otpInputSuccess = (otpData) => {
    if (otpData?.reset) {
      setOtpValue("");
      return;
    }
    resetOtpError();
    if (otpData.value) {
      setOtpValue(otpData.value);
    }
  };

  const on2FAComplete = (token, user) => {
    showSnackBar("auth-success", true);
    onAuthSuccess({ token, user }); // delegate to adapter (saves token, updates user)
  };

  const generateEmailOTP = () => {
    resetOtpError(true);
    setSendCodeRequest(true);

    config.services
      .generateEmailOTP({ userHash: userAuthData.userHash, authType: 2 })
      .then(() => {
        setStartTimerFlag(true);
        showSnackBar("OTP has been resent to your Email", true);
      })
      .catch(() => {
        showSnackBar("sm-went-wrong-contact-support");
      })
      .finally(() => {
        setSendCodeRequest(false);
      });
  };

  const verifyOTP = () => {
    config.services
      .verifyOTP({
        userHash: userAuthData.userHash,
        authType: userAuthData.authType,
        otp: otpValue,
      })
      .then((res) => {
        if (res?.token) {
          on2FAComplete(res.token, res.user);
        } else {
          showOTPError("Something went wrong, Please try again later");
        }
      })
      .catch(() => {
        showOTPError("Invalid OTP");
      });
  };

  return (
    <Stack justifyContent="center" alignItems="center" sx={{ margin: "16rem auto" }}>
      {userAuthData.authType == 2 && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            width: "100%",
            bgcolor: "success.main",
            color: "white",
            borderRadius: 1,
            p: 1.5,
            boxShadow: 1,
            mb: 2,
          }}
        >
          <CheckCircleIcon />
          <Stack spacing={0.01} sx={{ ml: 2 }}>
            <Typography variant="body1">
              <FormattedMessage id="succss" />
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
              <FormattedMessage id="enter-6digit-otp-email" />
            </Typography>
          </Stack>
        </Stack>
      )}

      <Stack padding={1}>
        <Typography variant="h5" fontSize={20}>
          <FormattedMessage id="Two-Factor-Authentication" />
        </Typography>

        <Stack mt={2}>
          <OTPInput areCharsAllowed={userAuthData.authType == 1} onSuccess={otpInputSuccess} error={otpError} />
          {otpError.status && (
            <Typography sx={{ textAlign: "left", color: "error.main", mt: 1, fontSize: "0.8rem" }}>
              {otpError.message}
            </Typography>
          )}
        </Stack>

        <Stack mt={2}>
          <Typography variant="subtitle2" fontWeight={600}>
            <FormattedMessage id="text-2Fa" />
          </Typography>
          <Typography variant="subtitle2" color="grey">
            <FormattedMessage id="text-2fa2" />
          </Typography>
          {config?.twoFactorAuth?.helpLink && (
            <Typography variant="subtitle2" color="blue">
              <Link href={config.twoFactorAuth.helpLink} target="__blank">
                <FormattedMessage id="Learn-more" />
              </Link>
            </Typography>
          )}
        </Stack>

        <Stack spacing={2} mt={2} alignItems="center" sx={{ width: "100%" }}>
          <Button
            disabled={otpValue.length < 6 || otpError.status}
            variant="contained"
            type="submit"
            sx={{ width: "100%" }}
            onClick={verifyOTP}
          >
            <FormattedMessage id="Authenticate" />
          </Button>

          {userAuthData.authType == 2 && (
            <Typography sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FormattedMessage id="didnot-rcv-otp" />{" "}
              {startTimerFlag ? (
                <OTPTimer startTimer={startTimerFlag} timerCompleteCallback={timerCompleteCallback} />
              ) : (
                <Link
                  disabled={sendCodeRequest}
                  href="#"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    generateEmailOTP();
                  }}
                  sx={{ ml: 1 }}
                >
                  <FormattedMessage id="Resend" />
                </Link>
              )}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
