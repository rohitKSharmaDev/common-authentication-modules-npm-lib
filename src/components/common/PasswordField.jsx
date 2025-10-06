import { Box, FormControl, TextField, Typography, Stack, InputAdornment, IconButton } from "@mui/material";
import { useField } from "formik";
import { Eye, EyeSlash } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { strengthColor, strengthIndicator } from "../../utils/password-strength";

const showPasswordTrigger = (showPassword, setShowPassword) => {
  return (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPassword(prevState => !prevState)}
        onMouseDown={event => event.preventDefault()}
        edge="end"
        color="secondary"
      >
        {showPassword ? <Eye /> : <EyeSlash />}
      </IconButton>
    </InputAdornment>
  )
};

const styles = {
  redAsterisk: {
    color: 'red'
  }
};


const PasswordField = ({label, name, legend, asterisk=false, showStrength, isSubmitting=false, ...otherProps}) => {
  const [strengthLevel, setStrengthLevel] = useState();
  
  const [showPassword, setShowPassword] = useState(false);  

  const [field, meta] = useField(name);

  useEffect(() => {
    setStrengthLevel(strengthColor(strengthIndicator(field.value)));
  }, [field.value]);

  const ymTextFieldConfig = {
    ...field,
    ...otherProps,
    fullWidth: true,
    error: false,
    label: legend,
    type: showPassword ? 'text' : 'password',
    InputProps: {
        endAdornment: showPasswordTrigger(showPassword, setShowPassword),
        disabled: isSubmitting
    },
  };

  if(meta && meta.touched && meta.error) {
    ymTextFieldConfig.error = true;
    ymTextFieldConfig.helperText = meta.error;
  }

  return (
    <FormControl fullWidth>
      {!!label && (
        <Box component="label" mb={1}>
          {label}
          {asterisk && <span style={styles.redAsterisk}>*</span>}
        </Box>
      )}

      <TextField 
        {...ymTextFieldConfig} 
        inputProps={{
            maxLength: 32,
        }}
        variant="outlined" 
      />
      { showStrength && (
        <Stack direction='row' alignItems='center' spacing={2} mt={2}>
          <Box sx={{ bgcolor: strengthLevel?.color, width: 85, height: 8, borderRadius: '7px' }} />
          <Typography variant="subtitle1" fontSize="0.75rem">{strengthLevel?.label}</Typography>
        </Stack>
      )}
    </FormControl>
  );
}

export default PasswordField;