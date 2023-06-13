import { DateRangePickerCalendar, START_DATE } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import { useQuery, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { filter, property } from 'lodash';
import { useState } from 'react';
import { messages } from './messages';
import Iconify from '../../components/iconify';
import NewSalePage from './NewSalePage';
import {
  Card,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  Button,
  TableContainer,
  TablePagination,
  Stack,
  Popover,
  Snackbar,
  Alert,
} from '@mui/material';
import Scrollbar from '../../components/scrollbar';
import { SaleListToolbar, SaleListHead } from 'src/sections/@dashboard/sales';
import { es } from 'date-fns/locale';
import { getData } from 'src/services/api';
import { getCompanyReport } from 'src/services/companies/companiesService';

const TABLE_HEAD = [
  { id: 'name', label: 'Client', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'products', label: 'Product: Quantity', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
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

function applySortFilter(array, comparator, query, startDate, endDate) {
  if (startDate && endDate) {
    const filteredArray = array?.filter((sale) => {
      const saleDate = new Date(sale.date);
      return (
        (!startDate || saleDate >= startDate) &&
        (!endDate || saleDate <= endDate)
      );
    });
    array = filteredArray;
  }
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_Sale) => _Sale.client.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function SalesPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteringDate, setFilteringDate] = useState(false);
  const [focus, setFocus] = useState(START_DATE);
  const companyId = localStorage.getItem('company-id');

  const handleFocusChange = (newFocus) => {
    setFocus(newFocus || START_DATE);
  };

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('client');
  const [filterName, setFilterName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const queryClient = useQueryClient();

  const { data: sales } = useQuery('getSales', () => getData(`sales`));

  const handleDoneCreating = async () => {
    await queryClient.refetchQueries('getSales');
    setIsCreating(false);
  };

  const handleNewSale = (event, property) => {
    //  handleCloseMenu();
    setIsCreating(true);
  };

  const handleNewReport = async () => {
    const result = await getCompanyReport('company/', companyId);
    if (
      result.statusCode === 400 ||
      result.statusCode === 500 ||
      result.statusCode === 401 ||
      result.statusCode === 404
    ) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage(result.message);
    }
    setTimeout(() => {}, 1000);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const handleFilterDate = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseFilterDate = () => {
    setOpen(null);
    setFilteringDate(true);
    setPage(0);
  };

  const onHandleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteringDate(false);
    setPage(0);
  };

  const formatDate = (date) => {
    const dateFormated = date.toDateString();
    const dateArray = dateFormated.split(' ');
    const reversedDate = `${dateArray[3]} ${dateArray[1]} ${dateArray[2]}`;
    return reversedDate;
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sales?.length) : 0;

  const filteredSales = applySortFilter(
    sales,
    getComparator(order, orderBy),
    filterName,
    startDate,
    endDate,
  );

  const isNotFound = !filteredSales?.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> {messages.sales.defaultMessage} </title>
      </Helmet>

      <Container>
        {isCreating ? (
          <NewSalePage
            companyId={companyId}
            handleDoneCreating={handleDoneCreating}
          />
        ) : (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h4" gutterBottom>
                {messages.sales.defaultMessage}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleNewSale}
              >
                {messages.newSale.defaultMessage}
              </Button>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="end"
              mb={5}
            >
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleNewReport}
              >
                {messages.report.defaultMessage}
              </Button>
            </Stack>
            <Card>
              <SaleListToolbar
                filterName={filterName}
                onFilterName={handleFilterByName}
                onHandleFilterDate={handleFilterDate}
                onHandleClearDate={onHandleClearDate}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <SaleListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      onRequestSort={handleRequestSort}
                    />
                    <Popover
                      open={Boolean(open)}
                      anchorEl={open}
                      onClose={handleCloseFilterDate}
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      PaperProps={{
                        sx: {
                          p: 1,
                          width: 260,
                          height: 380,
                          '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                          },
                        },
                      }}
                    >
                      <DateRangePickerCalendar
                        startDate={startDate}
                        endDate={endDate}
                        focus={focus}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onFocusChange={handleFocusChange}
                        locale={es}
                      />
                    </Popover>
                    <TableBody>
                      {filteredSales
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        ?.map((row) => {
                          const {
                            _id,
                            client,
                            date,
                            productList,
                            totalAmount,
                          } = row;

                          return (
                            <TableRow hover key={_id} tabIndex={-1}>
                              <TableCell></TableCell>
                              <TableCell
                                component="th"
                                align="left"
                                scope="row"
                              >
                                {client}
                              </TableCell>
                              <TableCell align="left">{date}</TableCell>
                              <TableCell align="left">
                                {productList?.map((item) => {
                                  return (
                                    <div key={item._id}>
                                      <Typography
                                        variant="body2"
                                        sx={{ display: 'inline-block' }}
                                      >
                                        {item.product.name}: &nbsp;
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{ display: 'inline-block' }}
                                      >
                                        {item.quantity}
                                      </Typography>
                                    </div>
                                  );
                                })}
                              </TableCell>

                              <TableCell align="left"> {totalAmount}</TableCell>
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
                count={filteredSales ? filteredSales.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>

            <Snackbar
              open={errorMessage !== null || successMessage !== null}
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
                <Alert severity="error">{errorMessage}</Alert>
              ) : (
                <Alert severity="success">{successMessage}</Alert>
              )}
            </Snackbar>
          </>
        )}
      </Container>
    </>
  );
}
