import React, { useState, useRef, useEffect } from "react";
import { Stack, TextField } from "@mui/material";

const OTPInput = ({ onSuccess, error, areCharsAllowed = false, usedInSet2FA = false }) => {
  const inputRefs = useRef([]);
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));

  useEffect(() => {
    if (error.reset) {
      setOtpValues(Array(6).fill(''));
      onSuccess({
        completed: false,
        value: "",
        reset: true
      });
    }
  }, [error]);

  const updateOtpValues = (updatedValues) => {
    setOtpValues(updatedValues);
    const completeOtp = updatedValues.join('');

    // Notify parent component of the current state
    onSuccess({
      completed: updatedValues.every(val => val.length === 1),
      value: completeOtp,
    });
  };

  const handleChange = (event, index) => {
    const { value } = event.target;

    if (areCharsAllowed && !/^[a-zA-Z0-9]*$/.test(value)) {
      return;
    } else if (!areCharsAllowed && !/^\d*$/.test(value)) {
      return;
    }

    const updatedValues = [...otpValues];
    updatedValues[index] = value;
    updateOtpValues(updatedValues);

    if (value.length === 1) {
      const nextIndex = index + 1 < inputRefs.current.length ? index + 1 : index;
      const nextInput = inputRefs.current[nextIndex];
      nextInput?.focus();
      if (nextInput?.value >= 0) {
        nextInput?.select();
      }
    }
  };

  const handlePaste = (event, index) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('Text');
    const updatedValues = [...otpValues];

    for (let i = 0; i < pasteData.length && index + i < updatedValues.length; i++) {
      updatedValues[index + i] = pasteData[i];
    }

    updateOtpValues(updatedValues);

    const nextInputIndex = Math.min(index + pasteData.length, updatedValues.length - 1);
    inputRefs.current[nextInputIndex]?.focus();
  };

  const handleKeyDown = (event, index) => {
    const { key } = event;

    if (key === 'Backspace') {
      if (otpValues[index].length === 0 && index > 0) {
        inputRefs.current[index - 1].focus();
        return;
      }
    }

    if (key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = index + 1 < otpValues.length ? index + 1 : index;
      inputRefs.current[nextIndex]?.focus();
    } else if (key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = index - 1 >= 0 ? index - 1 : index;
      inputRefs.current[prevIndex]?.focus();
    }
  };

  const handleMouse = (event, index) => {
    inputRefs.current[index]?.select();

    const input = inputRefs.current[index];
    if (input?.value.length > 0) {
      input?.select();
    }
  };

  return (
    <Stack direction="column" alignItems={usedInSet2FA ? 'flex-start' : 'center'}>
      <Stack direction="row" spacing={1} justifyContent="center">
        {Array(6).fill().map((_, index) => (
          <TextField
            key={index}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: { textAlign: 'center', fontWeight: 'bold' },
              inputMode: 'numeric',
              pattern: '[a-zA-Z0-9]*'
            }}
            sx={{ width: { sm : 50 }}}
            error={error.status}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            onMouseUp={(e) => handleMouse(e, index)}
            inputRef={el => (inputRefs.current[index] = el)}
            value={otpValues[index]}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default OTPInput;
