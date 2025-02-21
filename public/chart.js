document.addEventListener('DOMContentLoaded', () => {
  const totalClicksChartData = window.totalClicksChartData || [];

  const totalClicksChartOptions = {
    theme: {
      mode: 'dark',
    },
    colors: ['#0D6EFD', '#073577', '#7AA8FF', '#025FE2', '#E0E0E0'],
    chart: {
      height: 345,
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
    colors: ['#0D6EFD', '#073577', '#7AA8FF', '#025FE2', '#E0E0E0'],
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
    colors: ['#0D6EFD', '#073577', '#7AA8FF', '#025FE2', '#E0E0E0'],
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
    colors: ['#0D6EFD', '#073577', '#7AA8FF', '#025FE2', '#E0E0E0'],
    chart: {
      height: 345,
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

  const browserChartData = window.browserChartData || {};
  const browserChartOptions = {
    theme: {
      mode: 'dark',
    },
    colors: ['#0D6EFD', '#073577', '#7AA8FF', '#025FE2', '#E0E0E0'],
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
    series: browserChartData.data,
    labels: browserChartData.label,
  };

  const browserChart = new ApexCharts(
    document.querySelector('#browser-chart'),
    browserChartOptions
  );

  browserChart.render();

  const map = new Datamap({
    element: document.getElementById('country-visit-chart'),
    responsive: true,
    projection: 'mercator',
    fills: {
      defaultFill: '#E0E0E0',
      high: '#073577',
      medium: '#0D6EFD',
      low: '#7AA8FF',
    },
    data: window.countryChartData,
    geographyConfig: {
      popupOnHover: true,
      highlightFillColor: '#7AA8FF',
      popupTemplate: function (geo, data) {
        return `<div class="hoverinfo hoverinfo-custom">${
          geo.properties.name
        }: ${data ? data.clicks : 'No data'}</div>`;
      },
    },
  });
});
