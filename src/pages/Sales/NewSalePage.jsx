import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import Logo from '../../components/logo';
import { messages } from './messages';
import { Form } from 'src/sections/@dashboard/purchases';

import { StyledRoot, StyledContent } from '../Styles';

export default function NewSalePage({ companyId, handleDoneCreating }) {
  return (
    <>
      <Helmet>
        <title>
          {'Create Sale'}
          {messages.title.defaultMessage}
        </title>
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
              {'Create Sale'}
            </Typography>
            <Form
              companyId={companyId}
              handleDoneModifying={handleDoneCreating}
              isCreatingSale={true}
            />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
