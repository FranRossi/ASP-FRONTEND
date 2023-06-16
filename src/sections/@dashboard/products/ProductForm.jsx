import { useEffect, useState } from 'react';
import {
  Stack,
  Box,
  InputAdornment,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import {
  createProduct,
  editProduct,
} from '../../../services/products/productsService';

export default function ProductForm({
  editingProduct,
  companyId,
  handleDoneModifying,
}) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState();
  const [stock, setStock] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingProduct) {
      setId(editingProduct._id);
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setStock(editingProduct.stock);
    }
  }, [editingProduct]);

  const handleClick = async (event) => {
    const data = {
      name: name,
      description: description,
      price: price,
      stock: stock,
    };
    const result = editingProduct
      ? await editProduct('products/', id, data, companyId)
      : await createProduct('products', data, companyId, image);
    if (
      result.statusCode === 400 ||
      result.statusCode === 500 ||
      result.statusCode === 401 ||
      result.statusCode === 404 ||
      result.statusCode === 403
    ) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage(null);
      setSuccessMessage(
        editingProduct
          ? 'Product edited successfully.'
          : 'Product added successfully.',
      );
      setTimeout(() => {
        handleDoneModifying();
      }, 1500);
    }
  };

  return (
    <Box component="form" autoComplete="off">
      <Stack spacing={3}>
        <TextField
          name="name"
          label="Product name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="description"
          label="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          name="price"
          label="Price USD"
          required
          type="number"
          value={price || ''}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          name="stock"
          label="Stock"
          required
          type="number"
          value={stock || ''}
          onChange={(e) => setStock(e.target.value)}
        />
        {!editingProduct && (
          <TextField
            type="file"
            name="image"
            label="Product image"
            onChange={(e) => setImage(e.target.files[0])}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="heroicons-outline:photograph" />
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>

      <LoadingButton
        sx={{ mt: 3 }}
        fullWidth
        size="large"
        variant="contained"
        disabled={!name || !description || !price || !stock || (!image && !editingProduct)}
        onClick={handleClick}
      >
        {editingProduct ? 'Edit' : 'Create'} Product
      </LoadingButton>

      <Snackbar
        open={errorMessage !== null || successMessage !== null}
        autoHideDuration={1500}
        onClose={() => {
          setErrorMessage(null);
          setSuccessMessage(null);
        }}
        style={{ left: '60%', transform: 'translateX(-50%)' }}
      >
        {errorMessage !== null ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : (
          <Alert severity="success">{successMessage}</Alert>
        )}
      </Snackbar>
    </Box>
  );
}
