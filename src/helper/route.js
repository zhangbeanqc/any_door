const promisify = require('util').promisify;
const fs = require('fs');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path');
// const config = require('../config/defaultConfig.js')
const Handlebars = require("handlebars");

const tplPath = path.join(__dirname, '../template/dir.html');
const source = fs.readFileSync(tplPath, 'utf-8');
const template = Handlebars.compile(source);

const mime = require('./mime');
const compress = require('./compress');

const range = require('./range');
const isCacheValid = require('./cache');


module.exports = async function(req, resp, filePath, config) {

  // Use try catch to replace all
  // if (err) cases
  // get result from await func(), then use them
  try {

    const stats = await stat(filePath);

    if (stats.isFile()) {
      const contentType = mime(filePath);

      resp.setHeader('Content-Type', contentType);

      if (isCacheValid(stats, req, resp)) {
        resp.statusCode = 304;
        resp.end();
        return;
      }

      let rs;
      let totalSize = stats.size;

      // To test this part, please use
      // curl -i -r 0-10 http://127.0.0.1:3000/files/longFile.txt

      const {code, start, end} = range(totalSize, req, resp);
      resp.statusCode = code;
      if (code === 200) {
        rs = fs.createReadStream(filePath);
      } else {
        rs = fs.createReadStream(filePath, {start, end});
      }

      if (filePath.match(config.compress)) {
        rs = compress(rs, req, resp);
      }
      rs.pipe(resp);

    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      resp.statusCode = 200;
      resp.setHeader('Content-Type', 'text/html');

      // When config.root and filePath are the same, dir = ""
      const dir = path.relative(config.root, filePath);
      // These information will be used by template
      const data = {
        title: path.basename(filePath),

        // How to reach filePath from config.root
        // config.root = 'd:\Study\nodejs\any_door\src'
        // if filePath = 'd:\Study\nodejs\any_door\node_modules'
        // then path.relative() will return ..\node_modules
        // This method doesn't search the real path, but only analyzes these 2 parameters
        // If dir is "" then return "" else put it to root
        // Why do we do so many conversion? It is to fix the issue when execution path is different to that of source code
        dir: dir ? `/${dir}` : '',

        // this line will create files: array
        files: files.map(file => {
          return {
            file,
            icon: mime(file)
          }
        })
      };

      // Create response with template + data
      resp.end(template(data));
    }
  } catch (ex) {
    console.error(ex);
    resp.statusCode = 404;
    resp.setHeader('Content-Type', 'text/plain');
    resp.end(`${filePath} doesn't exist.`);
  }
}
