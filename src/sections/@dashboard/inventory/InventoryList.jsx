import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import ShopInventoryCard from './InventoryCard';

InventoryList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function InventoryList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product._id} item xs={12} sm={6} md={3}>
          <ShopInventoryCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
