import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { phoneCodesData } from "../../constants/phoneCodeData";
import LangSelector from "../../components/LangSelector/LangSelector.jsx";

import SignUpAccActvtnConfrmtnPage from "../../components/SignUpAccActvtnConfrmtnPage/SignUpAccActvtnConfrmtnPage.jsx";
import { KeyboardArrowLeft, LocalPhone, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import { useAuthContext } from "../../providers/AuthProvider.jsx";

const PasswordField = ({ name, label, labelType, error, onUpdate, autofocus, invalidOldPasswordError }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isLabelIsolated = labelType == 'isolated';

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Field name={name}>
      {({ field, meta }) => (
        <Stack spacing={1}>
          {isLabelIsolated && <InputLabel>{label}</InputLabel>}
          <TextField
            {...field}
            autoFocus={autofocus}
            onChange={(e) => {
              onUpdate && onUpdate();
              field.onChange(e)
            }}
            size={isLabelIsolated ? "small" : "medium"}
            label={!isLabelIsolated ? label : undefined}
            type={showPassword ? "text" : "password"}
            InputLabelProps={isLabelIsolated ? undefined : { shrink: true }}
            fullWidth
            error={(meta.touched && Boolean(meta.error)) || error}
            helperText={(meta.touched && meta.error) || invalidOldPasswordError}
            inputProps={{
              maxLength: 32,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
              autoComplete: "off"
            }}
          />
        </Stack>
      )}
    </Field>
  );
};


const HeaderBoxStyle = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  display: "flex",
  backgroundColor: "#fff",
  borderBottom: ".0625rem solid #dadce0",
  padding: ".8125rem 1.25rem",
  height: "4.0625rem",
  zIndex: "100",
};

const url = new URL(window.location.href);

const authCode = url.searchParams.get("authCode");

const initialValues = {
  secret: authCode,
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  phoneCountryCode: "91",
};

function AcceptInvitationPage() {
  const { config, notify } = useAuthContext();

  const intl = useIntl();
  const getMessage = (id) => intl.formatMessage({ id });

  const [isAccActSuccess, setIsAccActSuccess] = useState(false);

  const showSnackBar = (msg) => {
    notify(getMessage(msg), "error");
  };
  const handleActivateButton = async (value) => {
    try {
      const res = await config.services.acceptInvite(value);

      if (res.status === 201) {
        setIsAccActSuccess(true);
      }
    } catch (error) {
      if (error.status == 409) {
        showSnackBar("A valid invite was not found");
      }
      console.log("Error in activate account", error);
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(<FormattedMessage id="Password-is-required" />)
      .min(8, getMessage("password-minimum-8-characters"))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
        getMessage("password-errortext")
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], getMessage("Password-do-not-match"))
      .test(
        "passwords-match",
        getMessage("Password-do-not-match"),
        function (value) {
          return value !== null ? value === this.parent.password : false;
        }
      ),
    phoneNumber: Yup.string()
      .onlySpaceNotAllowed()
      .onlyNumberAllowed()
      .matches(/^[0-9]*$/, getMessage("enter-valid-phone-number"))
      .min(7, getMessage("minimum-7-characters"))
      .max(10, getMessage("maximum-10-characters"))
      .required(getMessage("enter-phone-number")),
  });

  return (
    <>
      {!isAccActSuccess ? (
        <>
          <Box sx={HeaderBoxStyle}>
            <Box
              backgroundColor="#fff"
              padding=".8125rem 1.25rem"
              height="4.0625rem"
              alignItems="center"
              marginBottom=".0625rem"
              display="flex"
            >
              <img
                src={config?.activeBrandConfig?.brandLogo.src}
                alt=""
                style={{ height: "1.875rem" }}
              />
            </Box>
            <LangSelector />
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleActivateButton(values)}
          >
            <Form>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={{ lg: 25, md: 25, sm: 15, xs: 5 }}
                mt={{ xs: 10, sm: 0 }}
              >
                <Stack width="20.625rem" spacing={3}>
                  <Stack>
                    <Typography variant="h4">
                      <FormattedMessage id="Activate-Account" />
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    >
                      <FormattedMessage id="Activate-account-instruction" />
                    </Typography>
                  </Stack>

                  <Stack gap="2rem">
                    <Field name="phoneNumber">
                      {({ field, meta }) => (
                        <TextField
                          {...field}
                          size="medium"
                          variant="outlined"
                          label={<FormattedMessage id="Phone-Number" />}
                          placeholder={intl.formatMessage({
                            id: "Phone-Number",
                          })}
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
                                  "&.MuiInputBase-root": { pl: 0 },
                                  "& #phoneCode.MuiSelect-standard": {
                                    py: 0,
                                    pl: 0,
                                    pr: 1,
                                    "&:focus": { backgroundColor: "#ffffff" },
                                  },
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
                            autoComplete: "off",
                          }}
                        />
                      )}
                    </Field>
                    <PasswordField
                      name="password"
                      label={<FormattedMessage id="Enter New Password*" />}
                    />
                    <PasswordField
                      name="confirmPassword"
                      label={<FormattedMessage id="Confirm Password*" />}
                    />
                  </Stack>

                  <Stack mt={1.5}>
                    <Button variant="contained" type="submit" size="medium">
                      <FormattedMessage id="Activate" />
                    </Button>
                    <Stack direction="row" mt={1}>
                      <Typography color="primary">
                        <KeyboardArrowLeft />
                      </Typography>
                      <Link component={RouterLink} to="/login">
                        <FormattedMessage id="back-to-signin" />
                      </Link>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Form>
          </Formik>
        </>
      ) : (
        <SignUpAccActvtnConfrmtnPage pageFor={"acc-activation"} />
      )}
    </>
  );
}

export default AcceptInvitationPage;
