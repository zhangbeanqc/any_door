const http = require('http');
const conf = require('./config/defaultConfig');
const path = require('path');
const route = require('./helper/route');

class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config)
  }

  start() {
    const server = http.createServer((req, resp) => {

      const filePath = path.join(this.conf.root, req.url);
      route(req, resp, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, ()=>{
      const addr = `${this.conf.hostname}:${this.conf.port}/`
      console.info(`Server running at http://${addr}`);
    })
  }
}

module.exports = Server;
