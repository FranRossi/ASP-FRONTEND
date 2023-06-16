import { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { es } from 'date-fns/locale';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker } from 'react-nice-dates';
import { useQuery } from 'react-query';
import 'react-nice-dates/build/style.css';
import { format } from 'date-fns';
import {
  Stack,
  Box,
  TextField,
  Snackbar,
  Alert,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { getData } from 'src/services/api';
import { createPurchase } from 'src/services/purchase/purchaseService';
import { createSale } from 'src/services/sales/salesService';

const animatedComponents = makeAnimated();

export default function Form({
  companyId,
  handleDoneModifying,
  isCreatingSale,
}) {
  const [date, setDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAboutToFinish, setIsAboutToFinish] = useState(false);
  const [productsToSend, setProductsToSend] = useState([]);
  const [providerToSend, setProviderToSend] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [clientName, setClientName] = useState('');
  const [programDate, setProgramDate] = useState(false);

  const handleCheckBoxChange = (event) => {
    setProgramDate(event.target.checked);
  };

  const { data: productsStored } = useQuery('getProductsStored', () =>
    getData(`products`),
  );

  const { data: providersStored } = useQuery('getProvidersStored', () =>
    getData(`providers`),
  );

  const productsFormatted = productsStored?.map((product) => {
    return { value: product, label: product.name, quantity: 1 };
  });

  const providersFormatted = providersStored?.map((provider) => {
    return { value: provider._id, label: provider.name };
  });

  const handleCalculateTotalPrice = () => {
    const products = selectedProducts?.map((item) => {
      return {
        productId: item.value._id,
        quantity: parseInt(item.quantity),
        price: item.value.price,
      };
    });
    setProductsToSend(products);
    if (products) {
      calculateTotalPrice(products);
      setIsAboutToFinish(true);
    } else {
      setTotalPrice(0);
      setIsAboutToFinish(false);
    }
  };

  const calculateTotalPrice = (products) => {
    let total = 0;
    products.forEach((product) => {
      total += product.price * product.quantity;
    });
    setTotalPrice(total);
  };

  const handleClick = async (event) => {
    const productsWithoutPrice = productsToSend.map(
      ({ productId, quantity }) => ({ productId, quantity }),
    );
    const result = isCreatingSale
      ? await sendSale(productsWithoutPrice)
      : await sendPurchase(productsWithoutPrice);
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
      const message = isCreatingSale ? 'Sale' : 'Purchase';
      setSuccessMessage(message + ' added successfully.');
      setTimeout(() => {
        handleDoneModifying();
      }, 1500);
    }
  };

  const sendSale = async (productsWithoutPrice) => {
    let sale = {
      date: date,
      client: clientName,
      saleProducts: productsWithoutPrice,
      totalAmount: totalPrice,
    };
    if (programDate) {
      if (date <= new Date()) {
        let response = {
          statusCode: 400,
          message:  'La fecha programada debe ser posterior a la fecha actual',
        };
        return response;
      } else {
        sale.programDate = date;
        sale.date = null;
      }
    }
    return await createSale('sales', sale, companyId);
  };

  const sendPurchase = async (productsWithoutPrice) => {
    const purchase = {
      date: date,
      providerId: providerToSend.value,
      purchaseProducts: productsWithoutPrice,
      totalAmount: totalPrice,
    };
    return await createPurchase('purchase', purchase, companyId);
  };

  const formatDate = (dateSelected) => {
    const dateFormatted = format(dateSelected, 'yyyy-MM-dd', { locale: es });
    setDate(dateSelected);
  };

  const handleProductSelect = (selectedOption) => {
    setSelectedProducts([...selectedProducts, selectedOption]);
    handleCalculateTotalPrice();
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
    if (newSelectedProducts.length === 0) {
      setTotalPrice(0);
      setIsAboutToFinish(false);
    }
    handleCalculateTotalPrice();
  };

  const handleProductQuantityChange = (e, index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = e.target.value;
    setSelectedProducts(newSelectedProducts);
    handleCalculateTotalPrice();
  };

  return (
    <Box component="form" autoComplete="off">
      <Stack spacing={3}>
        {isCreatingSale && (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={programDate}
                  onChange={handleCheckBoxChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Es una venta programada"
            />
          </FormGroup>
        )}

        <DatePicker
          date={date}
          onDateChange={(value) => {
            formatDate(value);
          }}
          locale={es}
          format="dd/MM/yyyy"
        >
          {({ inputProps, focused }) => (
            <input
              className={'input' + (focused ? ' -focused' : '')}
              {...inputProps}
            />
          )}
        </DatePicker>
        <Typography variant="h6" gutterBottom>
          Add {isCreatingSale ? 'client ' : 'provider'}
        </Typography>
        {isCreatingSale ? (
          <TextField onChange={(event) => setClientName(event.target.value)}>
            Add client
          </TextField>
        ) : (
          <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            options={providersFormatted}
            onChange={(value) => setProviderToSend(value)}
          />
        )}

        {selectedProducts.map((product, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              value={product.label}
              required
              disabled
              style={{ marginRight: '10px' }}
            />
            <TextField
              type="number"
              min={1}
              max={1000}
              defaultValue={0}
              style={{ marginRight: '3px' }}
              onChange={(e) => handleProductQuantityChange(e, index)}
              required
              step={1}
              inputProps={{ min: 1 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRemoveProduct(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Typography variant="h6" gutterBottom>
          Add products
        </Typography>
        <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          options={productsFormatted}
          onChange={(value) => handleProductSelect(value)}
          defaultValue={null}
          required
        />

        {isAboutToFinish && (
          <TextField
            name="totalPrice"
            label="Total"
            required
            type="number"
            value={totalPrice}
            disabled
          />
        )}
      </Stack>

      <LoadingButton
        sx={{ mt: 3 }}
        fullWidth
        size="large"
        variant="contained"
        onClick={handleClick}
        disabled={totalPrice === 0}
      >
        Register {isCreatingSale ? 'Sale ' : 'Purchase'}
      </LoadingButton>

      <Snackbar
        open={errorMessage !== null || successMessage !== null}
        autoHideDuration={3000}
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
