import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import Logo from '../../components/logo';
import { ProductForm } from 'src/sections/@dashboard/products';
import { messages } from './messages';

import { StyledRoot, StyledContent } from '../Styles';

export default function NewProductPage({
  editingProduct,
  companyId,
  handleDoneModifying,
}) {
  return (
    <>
      <Helmet>
        <title>
          {editingProduct ? 'Edit Product' : 'New Product'}{' '}
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
              {editingProduct ? 'Edit Product' : 'New Product'}
            </Typography>
            <ProductForm
              editingProduct={editingProduct}
              companyId={companyId}
              handleDoneModifying={handleDoneModifying}
            />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
