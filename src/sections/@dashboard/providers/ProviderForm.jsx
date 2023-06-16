import { useEffect, useState } from 'react';
import { Stack, Box, TextField, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  createProvider,
  editProvider,
} from 'src/services/providers/providersService';

export default function ProviderForm({
  editingProvider,
  companyId,
  handleDoneModifying,
}) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (editingProvider) {
      setId(editingProvider._id);
      setName(editingProvider.name);
      setAddress(editingProvider.address);
      setEmail(editingProvider.email);
      setPhone(editingProvider.telephoneNumber);
    }
  }, [editingProvider]);

  const handleClick = async (event) => {
    const data = {
      name: name,
      address: address,
      email: email,
      telephoneNumber: phone,
    };

    const result = editingProvider
      ? await editProvider('providers/', id, data, companyId)
      : await createProvider('providers/', data, companyId);

    if (
      result.statusCode === 400 ||
      result.statusCode === 500 ||
      result.statusCode === 401 ||
      result.statusCode === 404 ||
      result.statusCode === 403
    ) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage(null);
      setSuccessMessage(
        editingProvider
          ? 'Provider edited successfully.'
          : 'Provider added successfully.',
      );
      setTimeout(() => {
        handleDoneModifying();
      }, 1500);
    }
  };

  return (
    <>
      <Box component="form" autoComplete="off">
        <Stack spacing={3}>
          <TextField
            name="name"
            label="Provider's name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            name="address"
            label="Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            name="email"
            label="Provider's email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            name="phone"
            label="Phone"
            required
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>

        <LoadingButton
          sx={{ mt: 3 }}
          fullWidth
          size="large"
          variant="contained"
          disabled={!email || !name || !address || !phone}
          onClick={handleClick}
        >
          {editingProvider ? 'Edit' : 'Create'} Provider
        </LoadingButton>
        <Snackbar
          open={errorMessage !== null || successMessage !== null}
          autoHideDuration={1500}
          onClose={() => {
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          style={{ left: '60%', transform: 'translateX(-50%)' }}
        >
          {errorMessage !== null ? (
            <Alert severity="error">{errorMessage}</Alert>
          ) : (
            <Alert severity="success">{successMessage}</Alert>
          )}
        </Snackbar>
      </Box>
    </>
  );
}
