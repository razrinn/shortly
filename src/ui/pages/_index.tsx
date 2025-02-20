import { FC } from 'hono/jsx';
import { Layout } from '~/ui/components/layout';

interface Props {
  success?: string;
  error?: string;
}

const IndexPage: FC<Props> = ({ success, error }) => {
  return (
    <Layout title='Home'>
      <div class='flex-fill d-flex align-items-center gap-4 justify-content-center flex-column'>
        <h1>Shorty - Open-source URL Shortener</h1>
        <form action='/' method='post'>
          <div class='row g-2'>
            <div class='col'>
              <input
                type='url'
                name='longUrl'
                class='form-control'
                placeholder='https://example.com/really-long-url-i-need-to-shorten'
                aria-label='Long URL'
                required
                value='https://example.com/really-long-url-i-need-to-shorten'
              />
            </div>
            <div class='col'>
              <input
                type='text'
                name='shortUrl'
                class='form-control'
                placeholder='short-url (optional)'
                aria-label='Short URL'
                pattern='[a-zA-Z0-9-]+'
                title='Only alphanumeric characters and dashes are allowed'
              />
            </div>
            <div class='col-12'>
              <button type='submit' class='btn btn-primary w-100'>
                Shorten
              </button>
            </div>
          </div>
        </form>
        {success && (
          <div class='alert alert-success' role='alert'>
            Short URL{' '}
            <a href={success} target='_blank'>
              {success}
            </a>{' '}
            created successfully!
          </div>
        )}
        {error && (
          <div class='alert alert-danger' role='alert'>
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
