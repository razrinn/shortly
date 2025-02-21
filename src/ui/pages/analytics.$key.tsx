import { html } from 'hono/html';
import { FC, useMemo } from 'hono/jsx';
import { Layout } from '~/ui/components/layout';

type GenericStats = { count: number; label: string };

interface Props {
  clicksStats: GenericStats[];
  osStats: GenericStats[];
  deviceStats: GenericStats[];
  refererStats: GenericStats[];
  browserStats: GenericStats[];
  countryStats: Record<string, { fillKey: string; clicks: number }>;
}

const AnalyticsDetailPage: FC<Props> = ({
  clicksStats,
  osStats,
  deviceStats,
  refererStats,
  countryStats,
  browserStats,
}) => {
  const clicksCount = useMemo(
    () =>
      clicksStats.map((d) => ({
        x: d.label,
        y: d.count,
      })),
    [clicksStats]
  );

  const osCount = useMemo(() => osStats.map((d) => d.count), [osStats]);
  const osLabel = useMemo(() => osStats.map((d) => d.label), [osStats]);

  const deviceCount = useMemo(
    () => deviceStats.map((d) => d.count),
    [deviceStats]
  );
  const deviceLabel = useMemo(
    () => deviceStats.map((d) => d.label),
    [deviceStats]
  );

  const browserCount = useMemo(
    () => browserStats.map((d) => d.count),
    [browserStats]
  );
  const browserLabel = useMemo(
    () => browserStats.map((d) => d.label),
    [browserStats]
  );

  const refererCount = useMemo(
    () => refererStats.map((d) => ({ x: d.label, y: d.count })),
    [refererStats]
  );

  const scripts = html` <script src="/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min.js"></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/datamaps/0.5.9/datamaps.world.min.js"
      integrity="sha512-ShMIwoBgGctXjiRZubJipPPimOnfP7JgsipylJsQ0mlQaHltZJM5MK4u/7QaBd2bWwDDQ93eDdorzUBC3PJBOA=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>`;

  return (
    <Layout title='Analytics Detail' scripts={scripts}>
      <div class='container'>
        <h1 class='mb-4'>Last 30 days Analytics</h1>
        <div class='row mb-4'>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-header'>
                <h2>Total Clicks</h2>
              </div>
              <div class='card-body'>
                <div id='total-clicks-chart' />
              </div>
            </div>
          </div>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-header'>
                <h2>Referer</h2>
              </div>
              <div class='card-body'>
                <div id='referer-chart' />
              </div>
            </div>
          </div>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-header'>
                <h2>Visit by Country</h2>
              </div>
              <div class='card-body'>
                <div id='country-visit-chart' style={{ height: '360px' }} />
              </div>
            </div>
          </div>
        </div>
        <div class='row mb-4'>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-header'>Browser Used</div>
              <div class='card-body'>
                <div id='browser-chart' />
              </div>
            </div>
          </div>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-header'>OS Used</div>
              <div class='card-body'>
                <div id='os-chart' />
              </div>
            </div>
          </div>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-header'>Device Used</div>
              <div class='card-body'>
                <div id='device-chart' />
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.totalClicksChartData = ${JSON.stringify(clicksCount)};
            window.osChartData = ${JSON.stringify({
              data: osCount,
              label: osLabel,
            })};
            window.deviceChartData = ${JSON.stringify({
              data: deviceCount,
              label: deviceLabel,
            })};
            window.browserChartData = ${JSON.stringify({
              data: browserCount,
              label: browserLabel,
            })};
            window.refererChartData = ${JSON.stringify(refererCount)};
            window.countryChartData = ${JSON.stringify(countryStats)};
          `,
        }}
      />
    </Layout>
  );
};

export default AnalyticsDetailPage;
