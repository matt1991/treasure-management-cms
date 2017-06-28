const qiniu = require('./qiniu');
require('ensure-dir')('logs');

qiniu.getFiles('dist/assets/**', path => `pinenut/${path.slice(5)}`)
.then(files => {
  qiniu.uploadFiles('hugo-assets', files, 'logs/qiniu.log');
});
