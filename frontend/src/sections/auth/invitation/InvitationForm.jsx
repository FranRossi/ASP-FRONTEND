import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
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
import { acceptInvitation } from 'src/services/invitations/invitationsService';

export default function InvitationForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [companyName, setCompanyName] = useState();
  const [idCompany, setIdCompany] = useState();
  const [emailInvited, setEmailInvited] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const company = urlParams.get('companyName');
    const companyId = urlParams.get('companyId');
    const email = urlParams.get('email');
    setCompanyName(company);
    setIdCompany(companyId);
    setEmailInvited(email);
  }, []);

  const handleClick = async (name, emailInvited, password, event) => {
    event.preventDefault();
    const data = {
      email: emailInvited,
      name: name,
      password: password,
    };
    const result = await acceptInvitation(
      'invitations/accepted',
      data,
      idCompany,
    );
    if (
      result.loginResult.result.statusCode === 400 ||
      result.loginResult.result.statusCode === 500 ||
      result.loginResult.result.statusCode === 401 ||
      result.loginResult.result.statusCode === 404 ||
      result.loginResult.result.statusCode === 403
    ) {
      setErrorMessage(result.loginResult.result.message);
    } else {
      setErrorMessage(null);
      setSuccessMessage('Accepted Invitation succesfully.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <Box component="form" autoComplete="off">
      <Stack spacing={3}>
        <TextField
          name="company"
          label="Company name"
          required
          value={companyName || ''}
          disabled
        />
        <TextField
          name="name"
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="email"
          label="Email address"
          required
          value={emailInvited}
          disabled
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
        onClick={(event) => handleClick(name, emailInvited, password, event)}
      >
        Accept invitation
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
  );
}
