import { useEffect, useState } from 'react';

// @mui
import {
  Stack,
  Box,
  TextField,
  Snackbar,
  Alert,
  Button,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { createInvitation } from 'src/services/invitations/invitationsService';
import { getCompany } from 'src/services/companies/companiesService';

const animatedComponents = makeAnimated();

// ----------------------------------------------------------------------

export default function UserInvitationForm({ companyId, handleDoneInviting }) {
  const [roleToSend, setRoleToSend] = useState(null);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const rolesToSelect = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Employee' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const company = await getCompany('companies', companyId);
      const name = company?.name;
      setCompanyName(name);
    };

    fetchData();
  }, [companyId]);

  const handleClick = async (event) => {
    const result = sendInvitation();
    if (result.statusCode === 400 || result.statusCode === 500) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage(null);
      const message =
        'Invitation to ' +
        email +
        ' with role ' +
        roleToSend.value +
        ' for company ' +
        companyName;
      setSuccessMessage(message + ' send successfully.');
      setTimeout(() => {
        handleDoneInviting();
      }, 1500);
    }
  };

  const sendInvitation = async () => {
    const invitation = {
      email: email,
      role: roleToSend.value,
      company: companyId,
    };
    return await createInvitation('invitations', invitation, companyId);
  };

  return (
    <Box component="form" autoComplete="off">
      <Stack spacing={3}>
        <Typography variant="h6" marginTop={5}>
          Select role
        </Typography>
        <TextField name="company" value={companyName} disabled />
        <TextField
          name="email"
          label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          options={rolesToSelect}
          onChange={(value) => setRoleToSend(value)}
        />
      </Stack>

      <Stack direction="row" justifyContent="center" spacing={2} marginTop={5}>
        <Button variant="contained" onClick={handleDoneInviting}>
          Cancel
        </Button>
        <LoadingButton
          sx={{ mt: 3 }}
          size="large"
          variant="contained"
          onClick={handleClick}
        >
          Send Invitation
        </LoadingButton>
      </Stack>

      <Snackbar
        open={errorMessage !== null || successMessage !== null}
        autoHideDuration={3000}
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
