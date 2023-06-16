const getChartData = (productSales = []) => {
  const labels = [];
  const series = [];

  productSales.forEach(({ name, quantity }) => {
    labels.push(name);
    series.push(quantity);
  });
  return { labels, series };
};

export default getChartData;
