import { html } from 'hono/html';
import { FC, useMemo } from 'hono/jsx';
import { Layout } from '~/ui/components/layout';

interface Props {
  clicksStats: { count: number; label: string }[];
  osStats: { count: number; label: string }[];
  deviceStats: { count: number; label: string }[];
  refererStats: { count: number; label: string }[];
  countryStats: Record<string, { fillKey: string; clicks: number }>;
}

const AnalyticsDetailPage: FC<Props> = ({
  clicksStats,
  osStats,
  deviceStats,
  refererStats,
  countryStats,
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

  const refererCount = useMemo(
    () => refererStats.map((d) => ({ x: d.label, y: d.count })),
    [refererStats]
  );

  return (
    <Layout title='Analytics Detail' scripts={html`<script src="/chart.js" />`}>
      <div class='container'>
        <div class='row justify-content-center mb-4'>
          <div class='col-sm-6'>
            <h2>Total Clicks (last 30 days)</h2>
            <div id='total-clicks-chart' />
          </div>
        </div>
        <div class='row justify-content-center mb-4'>
          <div class='col-sm-6'>
            <h2>Visit by Country (last 30 days)</h2>
            <div id='country-visit-chart' style={{ height: '500px' }} />
          </div>
        </div>
        <div class='row justify-content-center mb-4'>
          <div class='col-sm-6'>
            <h2>Referer Data (last 30 days)</h2>
            <div id='referer-chart' />
          </div>
        </div>
        <div class='row justify-content-center mb-4'>
          <div class='col-sm-6'>
            <h2>Browser Used (last 30 days)</h2>
            <div id='os-chart' />
          </div>
        </div>
        <div class='row justify-content-center mb-4'>
          <div class='col-sm-6'>
            <h2>Device Used (last 30 days)</h2>
            <div id='device-chart' />
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
            window.refererChartData = ${JSON.stringify(refererCount)};
            window.countryChartData = ${JSON.stringify(countryStats)};
          `,
        }}
      />
    </Layout>
  );
};

export default AnalyticsDetailPage;
