const {cache} = require('../config/defaultConfig');

function refreshRes(stats, resp) {

  const {maxAge, expires, cacheControl, lastModified, etag} = cache;

  if (expires) {
    resp.setHeader('Expires',  (new Date(Date.now() + maxAge * 1000)).toISOString());
  }

  if (cacheControl) {
    resp.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }

  if (lastModified) {
    resp.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if (etag) {
    // consider stats.size + stats.mtime (modified time)
    resp.setHeader('ETag', `${stats.size}-${encodeURIComponent(stats.mtime.toString())}`);
  }

}

module.exports = function isCacheValid(stats, req, resp) {
  refreshRes(stats, resp);
  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  if (!lastModified && !etag) {
    return false;
  }

  if (lastModified && lastModified !== resp.getHeader('Last-Modified')) {
    return false;
  }

  if (etag && etag !== resp.getHeader('ETag')) {
    return false;
  }

  return true;
};
