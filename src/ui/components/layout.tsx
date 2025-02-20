import { html } from 'hono/html';

interface Props {
  title?: string;
  children?: any;
  scripts?: ReturnType<typeof html>;
}

export const Layout = ({ title, children, scripts }: Props) => {
  return html`<!DOCTYPE html>
    <html data-bs-theme="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title ? `${title} | Shortly URL` : 'Shortly URL'}</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossorigin="anonymous"
        />
        <style>
          html,
          body {
            height: 100%;
          }

          .hoverinfo-custom {
            background: black !important;
            border-radius: 4px !important;
          }
        </style>
      </head>
      <body>
        <div class="container h-100 d-flex flex-column">
          <div class="d-flex gap-2 mb-4">
            <a href="/">Home</a>
            <a href="/analytics">Analytics</a>
          </div>
          ${children}
        </div>

        ${scripts}

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossorigin="anonymous"
        ></script>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min.js"></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/datamaps/0.5.9/datamaps.world.min.js"
          integrity="sha512-ShMIwoBgGctXjiRZubJipPPimOnfP7JgsipylJsQ0mlQaHltZJM5MK4u/7QaBd2bWwDDQ93eDdorzUBC3PJBOA=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        ></script>
      </body>
    </html>`;
};
