import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  Box,
  Stack,
  Link,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { LocalPostOffice, KeyboardArrowLeft } from "@mui/icons-material";
import { FormattedMessage,useIntl } from 'react-intl';
import { Link as RouterLink } from "react-router-dom";

import { useAuthContext } from "../../providers/AuthProvider.jsx";

const ForgetPasswordPage = () => {
  const { config, notify } = useAuthContext();

  const [inProgress, setInProgress] = useState(false);
  const intl = useIntl();
  const getMessage = (id) => intl.formatMessage({ id });

  const onSubmit = (data, { setErrors, resetForm }) => {
    setInProgress(true);
    config.services.sendForgetPasswordRequest(data).then((res)=> {
      notify(getMessage('password-reset-msg'), "success");
      resetForm();

    }).catch(err => {
      setErrors({
        email : <FormattedMessage id="email-not-exist" />
      })
    }).finally(() => {
      setInProgress(false);
    });
  };

  const validationSchema = yup.object({
    email: yup.string()
    .noLeadingOrTrailingSpace(<FormattedMessage id="invalid-email-address"/>)
    .email(<FormattedMessage id="invalid-email-address"/>)
    .required(<FormattedMessage id="Email-is-required"/>)
    .test("invalid-email", <FormattedMessage id="invalid-email-address"/>, (value) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(value);
    })
  })

  const initialValues = {
    email: ""
  };
  
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing='5' padding={1}>
          <Typography variant="h4" mb={1}>
            <b><FormattedMessage id="reset-your-password"/></b>
          </Typography>

          <Form noValidate>
            <Field name="email">
              {({ field, meta }) => (
              <TextField
                {...field}
                size="medium"
                label={<FormattedMessage id="email.label" defaultMessage="Email *" />}
                variant="outlined"
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
                fullWidth
                margin="normal"
                placeholder={intl.formatMessage({ id: "email@gmail.com" })}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LocalPostOffice />
                    </InputAdornment>
                  ),
                }}
              />
              )}
            </Field>
            
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled = {inProgress}
              sx={{
                mt:2, 
              }}
              fullWidth
            >
              <FormattedMessage id="get-reset-link"/>
            </Button>

            <Stack direction="row" mt={1}>
              <Typography color="primary"><KeyboardArrowLeft/></Typography>
              <Link component={RouterLink}  to="/login">
                <FormattedMessage id="back-to-signin" />
              </Link>
            </Stack>
          </Form>
          
        </Stack>
      </Box>
    </Formik>
  );
};

export default ForgetPasswordPage