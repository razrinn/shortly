import { Layout } from '~/ui/components/layout';

const IndexPage = () => {
  return (
    <Layout title='Home'>
      <div class='h-100 d-flex align-items-center gap-4 justify-content-center flex-column'>
        <h1>Shorty - Open-source URL Shortener</h1>
        <div class='row g-2'>
          <div class='col'>
            <input
              type='text'
              class='form-control'
              placeholder='https://example.com/really-long-url-i-need-to-shorten'
              aria-label='Long URL'
            />
          </div>
          <div class='col'>
            <input
              type='text'
              class='form-control'
              placeholder='/short-url'
              aria-label='Short URL'
            />
          </div>
          <div class='col-12'>
            <button type='submit' class='btn btn-primary w-100'>
              Shorten
            </button>
          </div>
        </div>
        <a href='/analytics'>Analytics</a>
      </div>
    </Layout>
  );
};

export default IndexPage;
