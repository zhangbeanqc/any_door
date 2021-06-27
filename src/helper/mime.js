const path = require('path');

const mimeTypes = {
  'css': 'text/css',
  'html': 'text/html',
  'jpg': 'image/jpeg',
  'json': 'application/json',
  'xml': 'text/xml',
  'txt': 'text/plain',
  'gif': 'image/gif',
  'js':  'text/javascript'
};

module.exports = (filePath) => {

  let ext = path.extname(filePath).split('.').pop().toLowerCase();

  if (!ext) {
    ext = filePath;
  }

  return mimeTypes[ext] || mimeTypes['txt'];
}
