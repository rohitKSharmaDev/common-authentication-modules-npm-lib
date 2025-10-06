import { Box, FormControl, TextField } from "@mui/material";
import { useField } from "formik";
import { debounce } from "lodash";
import React,{ useCallback, useEffect, useState } from "react";

const FORM_FIELD_DEBOUNCE_TIME = 250;

const styles = {
  redAsterisk: {
    color: 'red'
  }
};

const InputTextField = ({label, name, legend, asterisk=false, ...otherProps}) => {
  const [{ onBlur, value }, meta, { setValue }] = useField(name);

  const [inputValue, setInputValue] = useState('');

  const debouncedSetValue = debounce((value) => {setValue(value)}, FORM_FIELD_DEBOUNCE_TIME);

  const debouncedHandleBlur = debounce( (e) => onBlur(e), FORM_FIELD_DEBOUNCE_TIME);

  useEffect(() => { 
    setInputValue(value);  
  }, [value]);

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
    debouncedSetValue(e.target.value);
  }, []);
  
  const handleBlur = useCallback((e) =>{
    debouncedHandleBlur(e);
  },[])

  const ymTextFieldConfig = {
    ...otherProps,
    value: inputValue,
    name,
    onBlur: handleBlur,
    onChange: handleChange,
    fullWidth: true,
    error: false,
    label: legend,
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
      <TextField {...ymTextFieldConfig} variant="outlined"/>
    </FormControl>
  );
}

export default InputTextField;