const {createGzip, createDeflate} = require('zlib');

module.exports = (rs, req, resp) => {

  const acceptEncoding = req.headers['accept-encoding'];
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflat)\b/)) {
    return rs;
  } else if(acceptEncoding.match(/\bgzip\b/)) {
    resp.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  } else if (acceptEncoding.match(/\bdeflate\b/)) {
    resp.setHeader('Content-Encoding', 'deflate');
    return rs.pipe(createDeflate());
  }
}
