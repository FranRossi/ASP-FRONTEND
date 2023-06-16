import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';
import { messages } from './messages';

import { StyledContent } from '../Styles';

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> {messages.title.defaultMessage}</title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            {messages.pageNotFound.defaultMessage}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            {messages.description.defaultMessage}
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />
          <Button
            to="/"
            size="large"
            variant="contained"
            component={RouterLink}
          >
            {messages.home.defaultMessage}
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
