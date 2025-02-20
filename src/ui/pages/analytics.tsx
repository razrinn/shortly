import { FC } from 'hono/jsx';
import { UrlRow } from '~/types';
import { Layout } from '~/ui/components/layout';

interface Props {
  totalClicks: number;
  totalShortenedUrls: number;
  totalCountry: number;
  data: UrlRow[];
}

const AnalyticsPage: FC<Props> = ({
  totalClicks,
  totalShortenedUrls,
  totalCountry,
  data,
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <Layout title='Analytics'>
      <div class='container overflow-auto'>
        <div class='row'>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-body'>
                <h5 class='card-title'>Total Clicks</h5>
                <h1 class='card-text'>{formatNumber(totalClicks)}</h1>
              </div>
            </div>
          </div>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-body'>
                <h5 class='card-title'>Total Shortened URLs</h5>
                <h1 class='card-text'>{formatNumber(totalShortenedUrls)}</h1>
              </div>
            </div>
          </div>
          <div class='col-sm-4 mb-4'>
            <div class='card'>
              <div class='card-body'>
                <h5 class='card-title'>Total Country</h5>
                <h1 class='card-text'>{formatNumber(totalCountry)}</h1>
              </div>
            </div>
          </div>
        </div>
        <table class='table'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Short Url</th>
              <th scope='col'>Original Url</th>
              <th scope='col'>Total</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr>
                <td scope='row'>{i + 1}</td>
                <td>
                  <a href={`/analytics/${d.shortUrl}`}>{d.shortUrl}</a>
                </td>
                <td>
                  <a href={d.originalUrl}>
                    {d.originalUrl.slice(0, 24)}
                    {d.originalUrl.length > 24 ? '...' : ''}
                  </a>
                </td>
                <td>{d.clicksCount}</td>
                <td>
                  <a href={`/${d.shortUrl}`} target='_blank'>
                    Visit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
