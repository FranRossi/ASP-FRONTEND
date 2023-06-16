import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import Logo from '../../components/logo';
import { RegisterForm } from '../../sections/auth/register';
import { messages } from './messages';

import { StyledRoot, StyledSection, StyledContent } from '../Styles';

export default function RegisterPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> {messages.title.defaultMessage} </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              {messages.register.defaultMessage}
            </Typography>
            <img
              src="/assets/illustrations/illustration_login.png"
              alt="login"
            />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              {messages.company.defaultMessage}
            </Typography>
            <RegisterForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
