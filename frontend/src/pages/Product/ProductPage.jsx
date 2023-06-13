import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useQuery, useQueryClient } from 'react-query';

import { getData } from 'src/services/api';

import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Alert,
  Snackbar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import {
  ProductListHead,
  ProductListToolbar,
} from '../../sections/@dashboard/products';
import { deleteProduct, manageSubscriptionToProduct } from '../../services/products/productsService';
import NewProductPage from './NewProductPage';
import { messages } from './messages';
import { useState } from 'react';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'stock', label: 'Stock', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_Product) =>
        _Product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function ProductPage() {
  const companyId = localStorage.getItem('company-id');
  const email = localStorage.getItem('email');
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const queryClient = useQueryClient();
  let { data: products } = useQuery('getProducts', () => getData(`products`));

  const handleDoneModifying = async () => {
    await queryClient.refetchQueries('getProducts');
    setIsCreating(false);
    setIsEditing(false);
    setProduct(null);
    setProductId('');
  };

  const handleDeleteProduct = async (event) => {
    const result = await deleteProduct('products/', productId, companyId);
    if (
      result.statusCode === 400 ||
      result.statusCode === 500 ||
      result.statusCode === 401 ||
      result.statusCode === 404
    ) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage(result.message);
      setTimeout(() => {
        handleDoneModifying();
      }, 1500);
    }
    handleCloseMenu();
  };

  const handleEditProduct = async (event) => {
    setIsEditing(true);
    handleCloseMenu();
  };

  
  const handleSubscriptionProduct = async (isSubcribing) => {
    let url = 'products/'
    url += isSubcribing ? 'subscribe' : 'unsubscribe';
    const result = await manageSubscriptionToProduct(url, productId, companyId, email);
    if (
      result.statusCode === 400 ||
      result.statusCode === 500 ||
      result.statusCode === 401 ||
      result.statusCode === 404
    ) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage(result.message);
      setTimeout(() => {
        handleDoneModifying();
      }, 1000);
    }
    handleCloseMenu();
  }

  const handleNewProduct = async (event) => {
    setIsCreating(true);
    handleCloseMenu();
  };

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSelected([row.name]);
    setProductId(row._id);
    setProduct(row);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelected([]);
    setProductId(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products?.length) : 0;

  const filteredProducts = applySortFilter(
    products,
    getComparator(order, orderBy),
    filterName,
  );

  const isNotFound = !filteredProducts?.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> {messages.titleProduct.defaultMessage} </title>
      </Helmet>

      <Container>
        {isEditing || isCreating ? (
          <NewProductPage
            editingProduct={product}
            companyId={companyId}
            handleDoneModifying={handleDoneModifying}
          />
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
              <Typography variant="h4" gutterBottom>
                {messages.products.defaultMessage}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleNewProduct}
              >
                {messages.newProduct.defaultMessage}
              </Button>
            </Stack>

            <Card>
              <ProductListToolbar
                numSelected={selected?.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <ProductListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={filteredProducts?.length}
                      numSelected={selected?.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredProducts
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        ?.map((row) => {
                          const {
                            _id,
                            name,
                            description,
                            imageUrl,
                            price,
                            stock,
                          } = row;
                          const selectedProduct = selected.indexOf(name) !== -1;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={selectedProduct}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedProduct}
                                  onChange={(event) => handleClick(event, name)}
                                />
                              </TableCell>

                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar alt={name} src={imageUrl} />
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              <TableCell align="left">{description}</TableCell>

                              <TableCell align="left"> {price}</TableCell>
                              <TableCell align="left">{stock}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="large"
                                  color="inherit"
                                  onClick={(event) =>
                                    handleOpenMenu(event, row)
                                  }
                                >
                                  <Iconify icon={'eva:more-vertical-fill'} />
                                  <Snackbar
                                    open={
                                      errorMessage !== null ||
                                      successMessage !== null
                                    }
                                    autoHideDuration={1500}
                                    onClose={() => {
                                      setErrorMessage(null);
                                      setSuccessMessage(null);
                                    }}
                                    style={{
                                      left: '60%',
                                      transform: 'translateX(-50%)',
                                    }}
                                  >
                                    {errorMessage !== null ? (
                                      <Alert severity="error">
                                        {errorMessage}
                                      </Alert>
                                    ) : (
                                      <Alert severity="success">
                                        {successMessage}
                                      </Alert>
                                    )}
                                  </Snackbar>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <Paper
                              sx={{
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                {messages.notFound.defaultMessage}
                              </Typography>

                              <Typography variant="body2">
                                No results found for &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
                                <br /> Try checking for typos or using complete
                                words.
                              </Typography>
                            </Paper>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={products ? products.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </>
        )}
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
         <MenuItem onClick={() => handleSubscriptionProduct(true)}>
          <Iconify icon={'eva:email-outline'} sx={{ mr: 2 }} />
          {messages.subscribe.defaultMessage}
        </MenuItem>
        <MenuItem onClick={() => handleSubscriptionProduct(false)}>
          <Iconify icon={'eva:email-fill'} sx={{ mr: 2 }} />
          {messages.unSubscribe.defaultMessage}
        </MenuItem>
        <MenuItem onClick={handleEditProduct}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          {messages.edit.defaultMessage}
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteProduct}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {messages.delete.defaultMessage}
        </MenuItem>
      </Popover>
    </>
  );
}
