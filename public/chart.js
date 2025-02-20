document.addEventListener('DOMContentLoaded', () => {
  const totalClicksChartData = window.totalClicksChartData || [];

  const totalClicksChartOptions = {
    theme: {
      mode: 'dark',
    },
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: 'Click counts',
        data: totalClicksChartData,
      },
    ],
    xaxis: {
      labels: {
        show: false,
      },
    },
  };

  const totalClicksChart = new ApexCharts(
    document.querySelector('#total-clicks-chart'),
    totalClicksChartOptions
  );
  totalClicksChart.render();

  const osChartData = window.osChartData || {};
  const osChartOptions = {
    theme: {
      mode: 'dark',
    },
    chart: {
      type: 'pie',
      toolbar: {
        show: false,
      },
      theme: 'dark',
    },
    tooltip: {
      theme: 'dark',
    },
    series: osChartData.data,
    labels: osChartData.label,
  };

  const osChart = new ApexCharts(
    document.querySelector('#os-chart'),
    osChartOptions
  );

  osChart.render();

  const deviceChartData = window.deviceChartData || {};
  const deviceChartOptions = {
    theme: {
      mode: 'dark',
    },
    chart: {
      type: 'pie',
      toolbar: {
        show: false,
      },
      theme: 'dark',
    },
    tooltip: {
      theme: 'dark',
    },
    series: deviceChartData.data,
    labels: deviceChartData.label,
  };

  const deviceChart = new ApexCharts(
    document.querySelector('#device-chart'),
    deviceChartOptions
  );

  deviceChart.render();

  const refererChartData = window.refererChartData || {};
  const refererChartOptions = {
    theme: {
      mode: 'dark',
    },
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    series: [
      {
        name: 'Click counts',
        data: refererChartData,
      },
    ],
    xaxis: {
      labels: {
        show: false,
      },
    },
  };

  const refererChart = new ApexCharts(
    document.querySelector('#referer-chart'),
    refererChartOptions
  );

  refererChart.render();

  const map = new Datamap({
    element: document.getElementById('country-visit-chart'),
    responsive: true,
    projection: 'mercator',
    fills: {
      defaultFill: '#E0E0E0',
      high: '#0e8078',
      medium: '#4ecdc5',
      low: '#afdedb',
    },
    data: window.countryChartData,
    geographyConfig: {
      popupOnHover: true,
      highlightFillColor: '#afdedb',
      popupTemplate: function (geo, data) {
        return `<div class="hoverinfo hoverinfo-custom">${
          geo.properties.name
        }: ${data ? data.clicks + ' clicks' : 'No data'}</div>`;
      },
    },
  });
});
