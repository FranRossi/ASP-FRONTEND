import { Helmet } from 'react-helmet-async';
import 'react-nice-dates/build/style.css';
import { useQuery, useQueryClient } from 'react-query';
import { filter } from 'lodash';
import { messages } from './messages';
import {
  Card,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Stack,
  Button,
} from '@mui/material';
import Scrollbar from '../../components/scrollbar';
import { SaleListToolbar, SaleListHead } from 'src/sections/@dashboard/sales';
import { getData } from 'src/services/api';
import { useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import NewPurchasePage from './NewPurchasePage';

const TABLE_HEAD = [
  { id: 'name', label: 'Provider', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'products', label: 'Product: quantity', alignRight: false },
  { id: 'amount', label: 'Total Amount', alignRight: false },
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
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_Purchase) =>
        _Purchase.provider.name.toLowerCase().indexOf(query.toLowerCase()) !==
        -1,
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function PurchasePage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('provider');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const companyId = localStorage.getItem('company-id');

  const queryClient = useQueryClient();

  const { data: purchases } = useQuery('getPurchases', () =>
    getData(`purchase`),
  );

  const handleDoneCreating = async () => {
    await queryClient.refetchQueries('getPurchases');
    setIsCreating(false);
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

  const handleNewPurchase = () => {
    setIsCreating(true);
  };

  const onHandleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - purchases?.length) : 0;

  const filteredPurchases = applySortFilter(
    purchases,
    getComparator(order, orderBy),
    filterName,
    startDate,
    endDate,
  );

  const isNotFound = !filteredPurchases?.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> {messages.purchase?.defaultMessage} </title>
      </Helmet>

      <Container>
        {isCreating ? (
          <NewPurchasePage
            companyId={companyId}
            handleDoneModifying={handleDoneCreating}
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
                {messages.purchase?.defaultMessage}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleNewPurchase}
              >
                {messages.newPurchase.defaultMessage}
              </Button>
            </Stack>

            <Card>
              <SaleListToolbar
                filterName={filterName}
                onFilterName={handleFilterByName}
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
                    <TableBody>
                      {filteredPurchases
                        ?.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                        ?.map((row) => {
                          const {
                            _id,
                            date,
                            provider,
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
                                {provider.name}
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
                                Not found
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
                count={filteredPurchases ? filteredPurchases.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </>
        )}
      </Container>
    </>
  );
}
