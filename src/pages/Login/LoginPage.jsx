import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  Stack,
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  CircularProgress,
  Link
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LocalPostOffice
} from "@mui/icons-material";
import { useIntl, FormattedMessage } from "react-intl";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";

import { useAuth, useAuthContext, useAuthAdapter } from "../../providers/AuthProvider.jsx";
import TwoFactorAuth from "./TwoFactorAuth.jsx"; // <-- library’s 2FA component

const LoginPage = () => {
  const adapter = useAuthAdapter();
  const { config, features } = useAuthContext();  // injected from consuming app
  const { onAuthSuccess } = useAuth();  // comes from authAdapter
  const intl = useIntl();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userAuthData, setUserAuthData] = useState({
    userHash: null,
    authType: null
  });
  const [showTimerNow, setShowTimerNow] = useState(false);

  useEffect(() => {
    if (state?.messageId && config?.notify) {
      adapter.notify(<FormattedMessage id={state.messageId} />);
    }
  }, [state, config]);

  return (
    <Stack>
      {/* ---------------- 1) Normal login form ---------------- */}
      {!userAuthData.authType && (
        <Stack height="100vh" justifyContent="center" alignItems="center">
          <Stack width={{ xs: "18rem", lg: "22.5rem" }}>
            {features?.showLoginPage && (
              <Formik
                initialValues={{ email: "", password: "" }}
                validate={(values) => {
                  const errors = {};
                  if (!values.email)
                    errors.email = intl.formatMessage({
                      id: "Please Enter Your Email"
                    });
                  if (!values.password)
                    errors.password = intl.formatMessage({
                      id: "Please Enter Your Password"
                    });
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const res = await config.services.login(values);
                    const { authType, userHash, token, user } = res;

                    setShowTimerNow(true);

                    if (authType != null && authType !== undefined) {
                      if (authType === 0) {
                        navigate("/set-2fa", { state: { userHash } });
                      } else {
                        setUserAuthData({ authType, userHash });
                      }
                    } else {
                      // ✅ login success → notify consumer
                      await onAuthSuccess({ token, user });
                      // navigate("/dashboard");
                    }
                  } catch (err) {
                    console.error("Login failed:", err);
                    setErrorMessage(
                      <FormattedMessage id="Invalid-email-or-password" />
                    );
                    setShowTimerNow(false);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form noValidate>
                    <Stack>
                      <Typography variant="h4">
                        <FormattedMessage id="Sign-In" />
                      </Typography>

                      {config?.activeBrandConfig.signupAllowed && (
                        <Box>
                          <Typography
                            component="span"
                            variant="body2"
                            color="grey"
                            fontWeight={500}
                          >
                            <FormattedMessage id="Don't have an account?" />
                          </Typography>{" "}
                          <Link component={RouterLink} underline="hover" to="/signup">
                            <FormattedMessage id="sign-up" />
                          </Link>
                        </Box>
                      )}
                    </Stack>

                    <Box height="30px">
                      {errorMessage && (
                        <Typography color="error" variant="body2">
                          {errorMessage}
                        </Typography>
                      )}
                    </Box>

                    <Field name="email">
                      {({ field, meta }) => (
                        <TextField
                          {...field}
                          size="medium"
                          fullWidth
                          variant="outlined"
                          label={<FormattedMessage id="Email" />}
                          InputProps={{
                            endAdornment: <LocalPostOffice fontSize="small" />
                          }}
                          InputLabelProps={{
                            shrink: true
                          }}
                          required
                          placeholder={intl.formatMessage({ id: "email@gmail.com" })}
                          error={Boolean(meta.touched && meta.error)}
                          helperText={meta.touched && meta.error}
                          sx={{ mb: 3.5 }}
                        />
                      )}
                    </Field>

                    <Field name="password">
                      {({ field, meta }) => (
                        <TextField
                          {...field}
                          type={showPassword ? "text" : "password"}
                          size="medium"
                          fullWidth
                          variant="outlined"
                          label={<FormattedMessage id="Password*" />}
                          placeholder="*************"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            endAdornment: (
                              <Stack
                                justifyContent="center"
                                onClick={() => setShowPassword((p) => !p)}
                                sx={{ cursor: "pointer" }}
                              >
                                {showPassword ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </Stack>
                            )
                          }}
                          error={Boolean(meta.touched && meta.error)}
                          helperText={meta.touched && meta.error}
                          inputProps={{ maxLength: 32 }}
                          sx={{ mb: 4.5 }}
                        />
                      )}
                    </Field>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={-1}
                    >
                      {config?.activeBrandConfig.brandName === "iZooto" && (
                        <Link component={RouterLink} to="/forget-password">
                          <Typography variant="body2">
                            <FormattedMessage id="Forgot-password" />
                          </Typography>
                        </Link>
                      )}
                    </Stack>

                    <Stack spacing={2} mt={1.5}>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{ lineHeight: "30px" }}
                        size="medium"
                        disabled={isSubmitting}
                        startIcon={
                          isSubmitting && (
                            <CircularProgress size={20} color="inherit" />
                          )
                        }
                      >
                        <FormattedMessage id="Sign-In" />
                      </Button>

                      {config?.activeBrandConfig.isGmailLoginAllowed && (
                        <Divider>
                          <Typography variant="subtitle2" color="grey">
                            <FormattedMessage id="OR" />
                          </Typography>
                        </Divider>
                      )}
                    </Stack>
                  </Form>
                )}
              </Formik>
            )}

            {config?.activeBrandConfig.isGmailLoginAllowed && (
              <Box
                component="form"
                action={config.services.gAuthUrl}
                method="POST"
                sx={{ mt: "15px" }}
              >
                <Button
                  type="submit"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ height: "42px" }}
                >
                  <Stack direction="row" gap={1.5} alignItems="center">
                    <img
                      src={config?.assets?.googleIcon}
                      style={{ width: "1.2rem" }}
                    />
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      <FormattedMessage id="Sign-in-With-Google" />
                    </Typography>
                  </Stack>
                </Button>
              </Box>
            )}
          </Stack>
        </Stack>
      )}

      {/* ---------------- 2) 2FA flow ---------------- */}
      {userAuthData.authType && (
        <Stack>
          <TwoFactorAuth
            userAuthData={userAuthData}
            startTimerNow={showTimerNow}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default LoginPage;
