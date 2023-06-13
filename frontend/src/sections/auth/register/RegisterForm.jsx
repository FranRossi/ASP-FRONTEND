import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { register } from '../auth';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const checkForm = (name, email, password, company) => {
    if (!name || !email || !password || !company) {
      setErrorMessage('Please fill all the fields');
      setSuccessMessage(null);
      return false;
    }
    return true;
  };

  const handleClick = async (name, email, password, company) => {
    if (!checkForm(name, email, password, company)) return;
    const result = await register(name, email, password, company);
    if(result.error !== null && result.statusCode === 427){
      setErrorMessage(result.error);
    }
    else if (
      result.loginResult.result.statusCode === 400 ||
      result.loginResult.result.statusCode === 500 ||
      result.loginResult.result.statusCode === 401 ||
      result.loginResult.result.statusCode === 404 ||
      result.loginResult.result.statusCode === 403
    ) {
      setErrorMessage(result.loginResult.result.message);
    } else {
      setErrorMessage(null);
      setSuccessMessage('Registered succesfully.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="name"
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="company"
          label="Company name"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
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
        onClick={() => handleClick(name, email, password, company)}
      >
        Register
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
