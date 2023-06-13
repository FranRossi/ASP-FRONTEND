import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
import { notifyStock } from 'src/services/products/productsService';
import { useState } from 'react';
// components

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'imageUrl',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { _id, name, imageUrl, price, stock } = product;
  const companyId = localStorage.getItem('company-id');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleNotifyStock = async () => {
    const result = await notifyStock('products/', _id, companyId);
    if (
      result.statusCode === 400 ||
      result.statusCode === 500 ||
      result.statusCode === 401 ||
      result.statusCode === 404
    ) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage(result.message);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 1500);
  };

  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 10,
              m: 1,
            }}
            onClick={handleNotifyStock}
          >
            Notify stock
          </Button>
          <StyledProductImg alt={name} src={imageUrl} />
        </Box>

        <Stack direction="row" spacing={2} sx={{ p: 3 }}>
          <Typography
            color="inherit"
            underline="hover"
            variant="subtitle1"
            noWrap
          >
            {name}
          </Typography>
          <Typography
            color="inherit"
            underline="hover"
            variant="subtitle2"
            noWrap
          >
            Stock: {stock}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle2">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
                marginLeft: '20px',
              }}
            ></Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Card>
      <Snackbar
        open={errorMessage !== null || successMessage !== null}
        autoHideDuration={1500}
        onClose={() => {
          setErrorMessage(null);
          setSuccessMessage(null);
        }}
        style={{
          left: '60%',
          transform: 'translateX(-50%)',
        }}
      >
        {errorMessage !== null  && successMessage === null ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : (
          <Alert severity="success">{successMessage}</Alert>
        )}
      </Snackbar>
    </>
  );
}
