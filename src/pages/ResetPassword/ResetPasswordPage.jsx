import { Box, Stack, Typography, Button, Link, TextField, IconButton, InputAdornment, InputLabel } from '@mui/material';
import React, {useLayoutEffect, useState} from 'react';
import { Formik, Form, Field } from 'formik';
import { FormattedMessage,useIntl } from 'react-intl';
import Validator from '../../utils/validator';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff, KeyboardArrowLeft } from '@mui/icons-material';
import { Link as RouterLink } from "react-router-dom";
import CircularLoader from '../../components/common/CircularLoader.jsx';
import { useAuth, useAuthContext } from "../../providers/AuthProvider.jsx";

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

const ResetPasswordPage = ({showOldPasswordField}) => {
  const { logout } = useAuth();
  const { config, notify } = useAuthContext();
  
  const [inProgress, setInProgress] = useState(false);
  const [invalidOldPasswordError,setInvalidOldPasswordError] = useState();
  const intl = useIntl();
  const navigate = useNavigate();
  const getMessage = (id) => intl.formatMessage({ id });
  const url = new URL(window.location.href);
  const authCode = url.searchParams.get('token');

  const initialValues = {
    authToken : authCode,
    password: "",
    confirmPassword: ""
  };

  const initialValuesForChangePassword = {
    oldPassword: "",
    password: "",
    confirmPassword: ""
  }

  const backToSignIn = () => {
    navigate('/login')
  }


  const handleSnackbar = (message) => {
    notify(message, "success");
  };

  const handleLogout = async () => {
    await logout();
  }

  const handleSave = async(values) => {
    try {
      if(!invalidOldPasswordError){
      const response = await config.services.changePasswordRequest(values);
      
      setTimeout(()=>{
        handleLogout();
        onClose();
      },2000)
      handleSnackbar(<FormattedMessage id="Your Password has been changed. Please login with new password"/>)
    }
    } catch (error) {
       if(error.status===409){
        setInvalidOldPasswordError(<FormattedMessage id='Invalid-old-password'/>)
       }
    }
  }
  //invalid request back to login
  useLayoutEffect(() => {
    if(!showOldPasswordField && !authCode) {
      backToSignIn();
    }
  }, []);
  

  const handleResetPassword = (data, { setErrors, resetForm }) => {
    try {
      setInProgress(true);
      config.services.sendRequest(data).then((res)=> {
        console.log("req sent => ", res.data);
        notify(getMessage("password-reset-success"), "success");
        
        setTimeout(() => {
          backToSignIn()
        }, 4000);
        resetForm();

      }).catch((err) => {
        if(err.body && err.body.error) {
          let error = err.body.error
          if(error == "INVALID_PASSWORD") {
            setErrors({
              password : <FormattedMessage id="invalid-password" />
            })
          } else {
            notify(getMessage("invalid-request"), "error");
          }
        } else {
          notify(getMessage(<FormattedMessage id="somthing-went-wrong" />), "error");
        }
      }).finally(() => {
        setInProgress(false);
        resetForm();
      });
    } catch (error) {
      console.log("Error in resetting password",error);
    }
 }

  const validationSchema = Validator.object({
    oldPassword : showOldPasswordField && Validator.string()
    .required(<FormattedMessage id="Old-password-is-required"/>)
    .min(6, getMessage("password-6-characters")
    ),
    password: Validator.string()
      .required(<FormattedMessage id="Password-is-required"/>)
      .min(6, getMessage("password-6-characters"))
      .max(32, getMessage("password-max-32"))
      .onlySpaceNotAllowed()
      .noSpaceAllowed()
      .strongPassword()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
        getMessage("password-errortext")
      ),
      confirmPassword: Validator.string()
      .oneOf([Validator.ref('password'), null], getMessage('Password-do-not-match'))
      .test(
        'passwords-match',
        getMessage('Password-do-not-match'),
        function (value) {
          return value !== null ? value === this.parent.password : false;
        }
      ),
  });
  return (
    <Formik
      initialValues={showOldPasswordField ? initialValuesForChangePassword : initialValues}
      validationSchema={validationSchema}
      onSubmit={showOldPasswordField ? handleSave : handleResetPassword}
    >
        <Form >
          <Box display="flex" justifyContent="center" alignItems="center" padding={{ lg: 25, md: 25, sm: 15, xs: 5 }}>
            <Stack width="22.5rem" spacing={4}>
              <Stack>
                <Typography variant='h4'><FormattedMessage id = "reset-password"/></Typography>
              </Stack>

              <Stack spacing={3.5}>
              {showOldPasswordField && <PasswordField name="oldPassword" label={<FormattedMessage id="Old Password*"/>} error={invalidOldPasswordError} onUpdate = {()=>setInvalidOldPasswordError('')}/>}
                <PasswordField name="password" label={<FormattedMessage id="Enter New Password*"/>} />
                <PasswordField name="confirmPassword" label={<FormattedMessage id="Confirm Password*"/>} />
              </Stack>


              <Stack gap={1}>
                <Button variant="contained" type='submit' size="medium" disabled = {inProgress} startIcon={inProgress && <CircularLoader/>}><FormattedMessage id="submit"/></Button>

                {!showOldPasswordField && <Stack direction="row">
                  <Typography color="primary"><KeyboardArrowLeft/></Typography>
                  <Link component={RouterLink}  to="/login">
                    <FormattedMessage id="back-to-signin" />
                  </Link>
                </Stack>}
              </Stack>

            </Stack>
          </Box>
        </Form>

    </Formik>
  );
}

export default ResetPasswordPage;