import React from 'react'
import { CircularProgress, Stack } from '@mui/material'

function CircularLoader() {
  return (
    <Stack>
      <CircularProgress sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} size={16} />
    </Stack>
  );
}

export default CircularLoader;