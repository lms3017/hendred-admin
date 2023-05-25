import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

type Props = {
  isLoading: boolean;
};

function Loading({ isLoading }: Props) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Loading;
