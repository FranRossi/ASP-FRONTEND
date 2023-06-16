import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { Container, Typography } from '@mui/material';
import { getData } from 'src/services/api';
import { InventoryList } from '../../sections/@dashboard/inventory';
import { messages } from './messages';

export default function InventoryPage() {
  let { data: products } = useQuery('getProducts', () => getData(`products`));

  return (
    <>
      <Helmet>
        <title> {messages.title.defaultMessage} </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {messages.inventory.defaultMessage}
        </Typography>
        {products && <InventoryList products={products} />}
      </Container>
    </>
  );
}
