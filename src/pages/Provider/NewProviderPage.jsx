import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import Logo from '../../components/logo';
import { ProviderForm } from 'src/sections/@dashboard/providers';
import { messages } from './messages';

import { StyledRoot, StyledContent } from '../Styles';

export default function NewProviderPage({
  editingProvider,
  companyId,
  handleDoneModifying,
}) {
  return (
    <>
      <Helmet>
        <title>
          {editingProvider ? 'Edit Provider' : 'New Provider'}{' '}
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
              {editingProvider ? 'Edit Provider' : 'New Provider'}
            </Typography>
            <ProviderForm
              editingProvider={editingProvider}
              companyId={companyId}
              handleDoneModifying={handleDoneModifying}
            />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
