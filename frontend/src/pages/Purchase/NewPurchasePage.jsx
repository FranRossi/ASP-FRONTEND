import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import { Form } from 'src/sections/@dashboard/purchases';
import Logo from '../../components/logo';
import { messages } from './messages';

import { StyledRoot, StyledContent } from '../Styles';

export default function NewPurchasePage({ companyId, handleDoneModifying }) {
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
              {messages.purchase.defaultMessage}
            </Typography>
            <Form
              companyId={companyId}
              handleDoneModifying={handleDoneModifying}
            ></Form>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
