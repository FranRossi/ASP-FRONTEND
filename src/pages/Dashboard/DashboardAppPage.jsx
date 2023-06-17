import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import SalesPage from '../Sales/SalesPage';
import { messages } from './messages';
import { useQuery } from 'react-query';
import { getData } from 'src/services/api';
import Chart from 'react-apexcharts';
import getChartData from 'src/utils/getChartData';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { format } from 'date-fns';
import { DatePicker } from 'react-nice-dates';

export default function DashboardAppPage() {
  const theme = useTheme();

  const [startDate, setStartDate] = useState(new Date('05/01/2023'));
  const [endDate, setEndDate] = useState(new Date('05/31/2023'));

  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  const { data: productSales } = useQuery(
    ['getProductSales', formattedStartDate, formattedEndDate],
    () =>
      getData(
        `sales/product-sales?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      ),
  );

  const { labels, series } = getChartData(productSales);

  return (
    <>
      <Helmet>
        <title>{messages.title.defaultMessage}</title>
      </Helmet>

      <Container maxWidth="xl" >
        <Grid container spacing={3} justify="center" alignItems="center" style={{ marginTop: '60px' }}>

          
          <Grid item xs={12} md={6} lg={10}>
          <Typography variant="h4">{'Sales Chart'}</Typography>
          
            <Typography variant="h9">{'Select start date'}</Typography>
            <DatePicker
              date={startDate}
              onDateChange={setStartDate}
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

            <Typography variant="h9">{'Select end date'}</Typography>
            <DatePicker
              date={endDate}
              onDateChange={setEndDate}
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
            <Typography variant="caption">{'*Select new dates to see updates'}</Typography>

            <Chart
              type="donut"
              width={600}
              height={600}
              options={{
                labels,
              }}
              series={series}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
