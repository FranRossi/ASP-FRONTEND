import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getData } from 'src/services/api';
import {
  Card,
  Snackbar,
  Alert,
  Table,
  Stack,
  Paper,
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
import { deleteProvider } from '../../services/providers/providersService';
import NewProviderPage from './NewProviderPage';
import { messages } from './messages';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
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

export default function ProviderPage() {
  const companyId = localStorage.getItem('company-id');

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [providerId, setProviderId] = useState('');
  const [provider, setProvider] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const queryClient = useQueryClient();
  const { data: providers } = useQuery('getProviders', () =>
    getData(`providers`),
  );

  const handleDoneModifying = async () => {
    await queryClient.refetchQueries('getProviders');
    setIsCreating(false);
    setIsEditing(false);
    setProvider(null);
    setProviderId('');
  };

  const handleDeleteProvider = async (event) => {
    const result = await deleteProvider('providers/', providerId, companyId);
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

  const handleEditProvider = async (event) => {
    setIsEditing(true);
    setOpen(null);
  };

  const handleNewProvider = async (event) => {
    setIsCreating(true);
    handleCloseMenu();
  };

  const handleOpenMenu = (event, row) => {
    setOpen(event.currentTarget);
    setSelected([row.name]);
    setProviderId(row._id);
    setProvider(row);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    setSelected([]);
    setProviderId(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = providers?.map((n) => n.name);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - providers?.length) : 0;

  const filteredProviders = applySortFilter(
    providers,
    getComparator(order, orderBy),
    filterName,
  );

  const isNotFound = !filteredProviders?.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> {messages.titleProvider.defaultMessage} </title>
      </Helmet>

      <Container>
        {isEditing || isCreating ? (
          <NewProviderPage
            editingProvider={provider}
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
                {messages.providers.defaultMessage}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleNewProvider}
              >
                {messages.newProvider.defaultMessage}
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
                      rowCount={filteredProviders?.length}
                      numSelected={selected?.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredProviders
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        ?.map((row) => {
                          const { _id, name, address, email, telephoneNumber } =
                            row;
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
                                align="left"
                                scope="row"
                                padding="none"
                              >
                                {name}
                              </TableCell>
                              <TableCell align="left">{address}</TableCell>
                              <TableCell align="left">{email}</TableCell>
                              <TableCell align="left">
                                {' '}
                                {telephoneNumber}
                              </TableCell>
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
                count={providers ? providers.length : 0}
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
        <MenuItem onClick={handleEditProvider}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          {messages.edit.defaultMessage}
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteProvider}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          {messages.delete.defaultMessage}
        </MenuItem>
      </Popover>
    </>
  );
}
