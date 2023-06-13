import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Link, Container, Typography, Divider } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import Logo from '../../components/logo';
import { LoginForm } from '../../sections/auth/login';
import { messages } from './messages';

import { StyledRoot, StyledSection, StyledContent } from '../Styles';

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();

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
              {messages.welcome.defaultMessage}
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
              {messages.signIn.defaultMessage}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {messages.dontHaveAccount.defaultMessage}
              <Link variant="subtitle2" onClick={() => navigate('/register')}>
                {messages.started.defaultMessage}
              </Link>
            </Typography>
            <Divider sx={{ my: 3 }}></Divider>
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
