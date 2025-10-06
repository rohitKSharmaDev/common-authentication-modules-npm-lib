import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

const OTPTimer = ({ startTimer, timerCompleteCallback }) => {
  const OTPTimeout = 45; // 5 seconds
  const theme = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(OTPTimeout);

  useEffect(() => {
    // If timer completes, call the callback
    if (secondsLeft === 0) {
      timerCompleteCallback();
      return;
    }

    // Set up the timer if secondsLeft is greater than 0
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [secondsLeft, timerCompleteCallback]);

  useEffect(() => {
    if (startTimer) {
      setSecondsLeft(OTPTimeout); // Reset the timer
    }
  }, [startTimer]);

  // Format secondsLeft for display
  const formattedTime = `00:${String(secondsLeft).padStart(2, '0')}`;

  return (
    <Typography sx={{ color: theme.palette.primary.main, padding: "0 0.3rem" }}>
      {formattedTime}
    </Typography>
  );
};

export default OTPTimer;
