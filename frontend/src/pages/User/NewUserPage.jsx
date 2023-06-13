import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import Logo from '../../components/logo';
import { messages } from './messages';
import { UserInvitationForm } from 'src/sections/@dashboard/user';

import { StyledRoot, StyledContent } from '../Styles';

export default function NewUserPage({ companyId, handleDoneInviting }) {
  return (
    <>
      <Helmet>
        <title>{messages.title.defaultMessage}</title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              {messages.user.defaultMessage}
            </Typography>
            <UserInvitationForm
              companyId={companyId}
              handleDoneInviting={handleDoneInviting}
            ></UserInvitationForm>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
