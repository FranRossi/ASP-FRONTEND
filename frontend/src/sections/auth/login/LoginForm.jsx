import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { login } from '../auth';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleClick = async (email, password) => {
    const loginResult = await login(email, password);
    if (loginResult.result.access_token) {
      setSuccessMessage('Logged in successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setErrorMessage(loginResult.result.message);
    }
  };
  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        sx={{ mt: 3 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={!email || !password}
        onClick={() => handleClick(email, password)}
      >
        Login
      </LoadingButton>

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
        {errorMessage !== null ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : (
          <Alert severity="success">{successMessage}</Alert>
        )}
      </Snackbar>
    </>
  );
}
