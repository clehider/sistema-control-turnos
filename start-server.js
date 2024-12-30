const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  let port = 3000;
  const maxPort = 3010;

  const startServer = () => {
    server.listen(port, (err) => {
      if (err) {
        if (err.code === 'EADDRINUSE' && port < maxPort) {
          console.log(`Puerto ${port} en uso, intentando con el siguiente...`);
          port++;
          startServer();
        } else {
          console.error('Error al iniciar el servidor:', err);
        }
      } else {
        console.log(`> Servidor listo en http://localhost:${port}`);
      }
    });
  };

  startServer();
});
