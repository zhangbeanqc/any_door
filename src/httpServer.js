const http = require('http');
const config = require('./config/defaultConfig');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, resp) => {

  const filePath = path.join(config.root, req.url);

  fs.stat(filePath, (err, stat) => {
    if (err) {
      resp.statusCode = 404;
      resp.setHeader('Content-Type', 'text/plain');
      resp.end(`${filePath} doesn't exist.`);
    }
    if (stat.isFile()) {
      resp.statusCode = 200;
      resp.setHeader('Content-Type', 'text/plain');

      // Slow
      // fs.readFile(filePath, (err, data) => {
      //   resp.end(data);
      // });

      fs.createReadStream(filePath).pipe(resp);
    } else if (stat.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        resp.statusCode = 200;
        resp.setHeader('Content-Type', 'text/plain');
        resp.end(files.join(','));
      })
    }
  });


  // resp.statusCode = 200;
  // resp.setHeader('Content-Type', 'text/html');
  // resp.end(filePath);
  // resp.write('<html>');
  // resp.write('<body>');
  // resp.write('Hello World!');
  // resp.write('</body>');
  // resp.write('</html>');
  // resp.end();
});

server.listen(config.port, config.hostname, ()=>{
  const addr = `${config.hostname}:${config.port}/`
  console.info(`Server running at http://${addr}`);
})


