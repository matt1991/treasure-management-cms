#!/bin/bash
node `dirname $0`/upload.js
if [[ "$1" == "production" ]]; then
    scp dist/index.html hugo@121.40.57.152:/home/hugo/www/CMS-EXPRESS/index.html
else
    scp -P 19123 dist/index.html hugo@121.43.181.142:/home/hugo/web/Sciuridae/index.html
fi
