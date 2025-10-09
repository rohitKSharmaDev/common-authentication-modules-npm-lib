import React, {useRef, useState, useEffect, useCallback } from "react";
import { Typography, TextField, Button, Box, Stack, Checkbox, Select, MenuItem, Link } from "@mui/material";
import { Formik, Field, Form, useField, useFormikContext} from "formik";
import { AccountCircle, LocalPhone, LocalPostOffice, VpnKey } from "@mui/icons-material";
import { FormattedMessage, useIntl } from 'react-intl';
import { phoneCodesData } from "../../constants/phoneCodeData";
import Validator from "../../utils/validator.js";
import { Link as RouterLink } from "react-router-dom";
import SignUpAccActvtnConfrmtnPage from "../../components/SignUpAccActvtnConfrmtnPage/SignUpAccActvtnConfrmtnPage.jsx";
import { debounce } from "lodash";
import CircularLoader from "../../components/common/CircularLoader.jsx";

import { useAuthContext, useAuthAdapter } from "../../providers/AuthProvider.jsx";

const CustomFieldDefaultValidationEvents = {
  onSuccess: () => { },
  onError: (err) => { },
  onComplete: () => { },
};

const Error = ({children}) => {
  return (
    <Typography sx={{
        fontSize: '0.65rem',
        lineHeight: '1.7',
        position: "absolute",
        bottom: 0,
        transform: "translateY(100%)",
        left: 0,
        right: 0,
        fontWeight: 500,
    }} color="error">{children}</Typography>
  );
};

const CustomTextField = ({ name, validateAsync = async (value, signal) => null, isValidRef, children }) => {
  const [field, meta, helpers] = useField(name);
  const form = useFormikContext();
  const [loading, setLoading] = useState(false);
  const { isValidating } = form;
  const innerFieldValue = useRef('');
  const innerFieldError = useRef('');
  const controllerRef = useRef(null);
  const innerMetaRef = useRef({});
  const { value } = field;

  innerMetaRef.current = { error: meta.error ? meta.error : innerFieldError.current, touched: meta.touched };

  const validate = useCallback(debounce(async (value, meta, isValidating, validationEvents = {}) => {
    validationEvents = { ...CustomFieldDefaultValidationEvents, ...validationEvents };
    try {
        if (innerFieldValue.current != value && !isValidating && !meta.error) {
          innerFieldValue.current = value;
          if (controllerRef.current) {
              controllerRef.current.abort();
          }
          controllerRef.current = new AbortController();
          const validationError = await validateAsync(value, controllerRef.current.signal);
          if (validationError) {
              innerFieldError.current = validationError;
              validationEvents.onError(validationError);
              helpers.setError(validationError)
          }
          else {
              validationEvents.onSuccess();
          }

        } else if (meta.error) {
          innerFieldValue.current = value;

        } else if (!meta.error && innerFieldError.current) {
          helpers.setError(innerFieldError.current);

        }

    } catch (err) {
      validationEvents.onError(err);
    } finally {
      validationEvents.onComplete();
    }
  }, 250), []);

  useEffect(() => {
    if (!value) return;

    if (innerFieldValue.current != value) {
      innerFieldError.current = '';
      setLoading(true);
      isValidRef.current = true;
      validate(value, meta, isValidating, {
        onSuccess: () => {
          isValidRef.current = false;
          setLoading(false)
        },
        onError: err => {
          if (err?.name != 'CanceledError') {
            isValidRef.current = false;
            setLoading(false);
          }
        }
      });
    }
  }, [value, isValidating]);

  return children({
      field,
      meta: innerMetaRef.current,
      form,
      loading,
  });
};

let initialValues = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  phoneCountryCode: "91",
  requestedChannels: [],
}

const SignUpPage = () => {
  const intl = useIntl();
  
  const adapter = useAuthAdapter();
  const { config } = useAuthContext();

  const rtlConfig = adapter.useConfig ? adapter.useConfig() : {};
  const isRtl = rtlConfig?.isRtl ?? config?.activeBrandConfig?.isRtl ?? false;
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const isAsyncValidatingRef = useRef(false);

  const validationSchema = Validator.object({
    name: Validator.string()
      .required(<FormattedMessage id="enter-username" />)
      .onlySpaceNotAllowed()
      .noLeadingOrTrailingSpace()
      .min(3, <FormattedMessage id="username-min-length" />)
      .isI18nUserName(),
    email: Validator.string()
      .databEmail(<FormattedMessage id="invalid-email-address" />)
      .max(255, <FormattedMessage id="email-max-length" defaultMessage="Email cannot be more than 255 characters long." />)
      .required(<FormattedMessage id="email-is-required" />)
      .noLeadingOrTrailingSpace(),
    password: Validator.string()
      .onlySpaceNotAllowed()
      .min(6, <FormattedMessage id="password-6-characters" />)
      .noSpaceAllowed()
      .strongPassword()
      .max(32, <FormattedMessage id="password-max-32" />)
      .required(<FormattedMessage id="password-is-required" />),
    phoneNumber: Validator.string()
      .onlySpaceNotAllowed()
      .onlyNumberAllowed()
      .min(7, <FormattedMessage id="minimum-7-characters" />)
      .max(16, <FormattedMessage id="maximum-16-characters" />)
      .required(<FormattedMessage id="enter-phone-number" />),
    requestedChannels: Validator.array()
      .of(Validator.string().oneOf(["WEB", "MESSENGER", "APPPUSH", "EMAIL"]))
      .min(1, <FormattedMessage id="Please select at least one." />)
  });

  const handleChannelChange = (form, e) => {
    const isChecked = e.target.checked;
    const value = e.target.value;
    
    if (isChecked) {
      form.setFieldValue("requestedChannels", [...form.values.requestedChannels, value]);
    } else {
      form.setFieldValue("requestedChannels", form.values.requestedChannels.filter(channel => channel !== value));
    }
  };

  const handleSubmit = async (values) => {
    isAsyncValidatingRef.current = false;

    try {
      setIsSubmitting(true)
      const res = await config.services.sendSignupRequest(values);
      
      if(res.status == 201) {
        setIsSignUpSuccess(true);
      }

    } catch (err) {
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleAsyncValidation = async (value, signal) => {
    const res = await config.services.isEmailExist(value, signal);
    if (res?.exists === true) {
      return "email-already-exists";
    } else {
      return "";
    }
  };

  return (
    <>
      { 
        !isSignUpSuccess ? <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          id="some"
          height="100vh"
        >
          <Stack width={{xs:"18rem", lg: '22.5rem' }}>
            <Stack mb={3}>
              <Typography variant="h4" marginBottom="0rem">
                <FormattedMessage id="sign-up" />
              </Typography>
              <Box>
                <Typography component='span' variant="body2" color={"grey"} fontWeight="500">
                  <FormattedMessage id="already-account" />
                </Typography>&nbsp;
                  <Link variant="body2" component={RouterLink} to="/login">
                      <FormattedMessage id="sign-in" />
                  </Link>
              </Box>
            </Stack>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              <Form noValidate>
                <Field name="name">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="medium"
                      label={
                        <FormattedMessage id="name.label" defaultMessage="Name *" />
                      }
                      placeholder={intl.formatMessage({ id: "john-smith" })}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      fullWidth
                      InputProps={{
                        endAdornment: <AccountCircle />,
                      }}
                      sx={{ mb: 3.5 }}
                    />
                  )}
                </Field>

                <CustomTextField
                  name="email"
                  validateAsync={handleAsyncValidation}
                  isValidRef={isAsyncValidatingRef}
                >
                  {({ field, meta, loading }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="medium"
                      label={<FormattedMessage id="email.label" defaultMessage="Email *" />}
                      placeholder={intl.formatMessage({ id: "email@gmail.com" })}
                      InputProps={{ endAdornment: <LocalPostOffice /> }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={
                        meta.touched &&
                        (loading ? (
                          "Checking availability..."
                        ) : typeof meta.error === "string" && meta.error.trim() !== "" ? (
                          // ✅ Only render FormattedMessage when meta.error is a valid string id
                          <FormattedMessage
                            id={meta.error}
                            values={{
                              signin: (
                                <Link href="/login">
                                  {intl.formatMessage({ id: "sign-in" })}
                                </Link>
                              ),
                            }}
                          />
                        ) : React.isValidElement(meta.error) ? (
                          // ✅ If it's already a React element, just render it directly
                          meta.error
                        ) : (
                          ""
                        ))
                      }
                      sx={{ mb: 3.5 }}
                    />
                  )}
                </CustomTextField>


                <Field name="password">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      size="medium"
                      label={
                        <FormattedMessage
                          id="password.label"
                          defaultMessage="Password *"
                        />
                      }
                      placeholder="*************"
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      fullWidth
                      type="password"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: <VpnKey />,
                      }}
                      sx={{ mb: 3.5 }}
                    />
                  )}
                </Field>

                <Field name="phoneNumber">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      size="medium"
                      variant="outlined"
                      label={<FormattedMessage id="Phone-Number" />}
                      placeholder={intl.formatMessage({ id: "Phone-Number" })}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Field
                            name="phoneCountryCode"
                            as={Select}
                            variant="standard"
                            id="phoneCode"
                            sx={{ 
                              '&.MuiInputBase-root': {pl: 0},
                              '& #phoneCode.MuiSelect-standard': { py: 0, pl: 0, pr: 1, '&:focus': { backgroundColor: '#ffffff' } }
                            }}
                            disableUnderline
                            renderValue={(value) => (
                              <Stack
                                justifyContent="center"
                                children={`+${value}`}
                              />
                            )}
                            children={phoneCodesData.map((countryData) => (
                              <MenuItem
                                key={countryData.countryName}
                                value={countryData.phoneCode}
                              >
                                {`+${countryData.phoneCode}, (${countryData.countryName})`}
                              </MenuItem>
                            ))}
                          />
                        ),
                        endAdornment: <LocalPhone />,
                      }}
                      sx={{ mb: 3 }}
                    />
                  )}
                </Field>
                <Stack spacing={1}>
                  <Typography fontWeight="500">
                    <FormattedMessage id="Which functionality are you interested in?" />
                  </Typography>
                  <Field name="requestedChannels">
                    {({ form, meta }) => (
                      <Stack spacing={1} position="relative">
                        <Stack direction={"row"} spacing={10}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={1}
                          >
                            <Checkbox
                              value={"WEB"}
                              checked={form.values.requestedChannels.includes(
                                "WEB"
                              )}
                              onChange={(e) => handleChannelChange(form, e)}
                            />
                            <Typography fontWeight="500">
                              <FormattedMessage id="Web Push" />
                            </Typography>
                          </Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={1}
                          >
                            <Checkbox
                              value={"MESSENGER"}
                              checked={form.values.requestedChannels.includes(
                                "MESSENGER"
                              )}
                              onChange={(e) => handleChannelChange(form, e)}
                            />
                            <Typography fontWeight="500">
                              <FormattedMessage id="Messenger" />
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack direction={"row"} spacing={isRtl ? 8.5 : 10.36}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={1}
                          >
                            <Checkbox
                              value={"APPPUSH"}
                              checked={form.values.requestedChannels.includes(
                                "APPPUSH"
                              )}
                              onChange={(e) => handleChannelChange(form, e)}
                            />
                            <Typography fontWeight="500">
                              <FormattedMessage id="App Push" />
                            </Typography>
                          </Stack>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            spacing={1}
                          >
                            <Checkbox
                              value={"EMAIL"}
                              checked={form.values.requestedChannels.includes(
                                "EMAIL"
                              )}
                              onChange={(e) => handleChannelChange(form, e)}
                            />
                            <Typography fontWeight="500">
                              <FormattedMessage id="Email" />
                            </Typography>
                          </Stack>
                        </Stack>
                        {meta.touched && meta.error && (
                          <Error>{meta.error}</Error>
                        )}
                      </Stack>
                    )}
                  </Field>
                </Stack>

                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting && <CircularLoader />}
                  sx={{
                    mt: 3,
                    mb: 1,
                  }}
                  fullWidth
                >
                  <FormattedMessage id="signup" />
                </Button>
                {
                  (config?.activeBrandConfig.termsOfServiceLink && config?.activeBrandConfig.privacyPolicyLink) ?
                    <Box>
                      <Typography component='span' variant="subtitle2">
                        <FormattedMessage 
                          id="privacy-policy-terms-and-conditions-label"
                          values={{
                            privacyPolicyLink: (chunks) => (
                              <Link href={config?.activeBrandConfig.privacyPolicyLink} target="_blank">
                                '{chunks}'
                              </Link>
                            ),
                            tncLink: (chunks) => (
                              <Link href={config?.activeBrandConfig.termsOfServiceLink} target="_blank">
                                '{chunks}'
                              </Link>
                            )
                          }}
                        />
                      </Typography>

                      {/* <Typography component='span' variant="subtitle2">
                        <FormattedMessage id="By signing up, you agree to our" />
                      </Typography>&nbsp;
                      <Typography component='span'>
                        <Link href={activeBrandConfig.privacyPolicyLink} target="_blank" underline='hover' color='primary'>
                          <FormattedMessage id="privacy-policy" />
                        </Link>
                      </Typography>&nbsp;
                      <Typography component='span' variant="subtitle2">&amp;</Typography>&nbsp;
                      <Typography component='span' variant="subtitle2">
                        <Link href={activeBrandConfig.termsOfServiceLink} target="_blank" underline='hover' color='primary'>
                          <FormattedMessage id="terms-of-service" />
                        </Link>
                      </Typography> */}
                    </Box>
                    : <></>
                }
              </Form>
            </Formik>
          </Stack>
        </Box> : 
        <SignUpAccActvtnConfrmtnPage pageFor={'signup'} />
      }
    </>
  );
};

export default SignUpPage;
